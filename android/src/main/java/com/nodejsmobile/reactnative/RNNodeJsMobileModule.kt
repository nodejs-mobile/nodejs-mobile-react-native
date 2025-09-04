package com.nodejsmobile.reactnative

import android.util.Log
import android.content.Context
import android.content.res.AssetManager
import android.content.pm.PackageManager
import android.system.Os
import android.system.ErrnoException
import java.io.File
import java.io.IOException
import java.io.FileNotFoundException
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.withContext
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.channels.Channel
import java.util.concurrent.Executors
import kotlinx.coroutines.asCoroutineDispatcher


import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field

class NodeJsOptions : Record {
    @Field
    val redirectOutputToLogcat: Boolean = true
}

class RNNodeJsMobileModule : Module() {
    private val reactContext: Context
        get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

    private val filesDir: File
        get() = reactContext.filesDir

    private val trashDir: File
        get() = File(filesDir, TRASH_DIR)

    // The directories where we expect the node project assets to be at runtime.
    private val nodeJsProjectDir: File
        get() = File(filesDir, NODEJS_PROJECT_DIR)

    private val builtinModulesDir: File
        get() = File(filesDir, NODEJS_BUILTIN_MODULES)

    private val nativeAssetsPath: String
        get() = "$BUILTIN_NATIVE_ASSETS_PREFIX${getCurrentABIName()}"
    private var lastUpdateTime: Long = 1
    private var previousLastUpdateTime: Long = 0
    private val moduleScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private val fileCopySemaphore = Semaphore(8) // Limit concurrent file operations
    private val initCompletionDeferred = CompletableDeferred<Unit>()

    // Dedicated thread for Node.js events - ensures order and keeps off main thread
    private val nodeEventDispatcher = Executors.newSingleThreadExecutor { r ->
        Thread(r, "NodeJS-Event-Dispatcher").apply {
            priority = Thread.MAX_PRIORITY // High priority for low latency
        }
    }.asCoroutineDispatcher()

    private val nodeEventScope = CoroutineScope(SupervisorJob() + nodeEventDispatcher)

    // Channel for lock-free message passing from Node.js thread to event dispatcher
    private val messageChannel = Channel<MessageData>(Channel.UNLIMITED)

    private val assetManager: AssetManager
        get() = reactContext.assets

    private data class MessageData(
        val channelName: String,
        val message: String,
        val timestamp: Long
    )

    companion object {
        const val EVENT_NAME = "nodejs-mobile-react-native-message"

        private const val TAG = "NODEJS-RN"
        private const val NODEJS_PROJECT_DIR = "nodejs-project"
        private const val NODEJS_BUILTIN_MODULES = "nodejs-builtin_modules"
        private const val TRASH_DIR = "nodejs-project-trash"
        private const val SHARED_PREFS = "NODEJS_MOBILE_PREFS"
        private const val LAST_UPDATED_TIME = "NODEJS_MOBILE_APK_LastUpdateTime"
        private const val BUILTIN_NATIVE_ASSETS_PREFIX = "nodejs-native-assets-"
        private const val SYSTEM_CHANNEL = "_SYSTEM_"

        // To store the instance when node is started.
        var instance: RNNodeJsMobileModule? = null
            private set
        // We just want one instance of node running in the background.
        var startedNodeAlready = false
            private set
        // Flag to indicate if node is ready to receive app events.
        var nodeIsReadyForAppEvents = false

        init {
            System.loadLibrary("nodejs-mobile-react-native-native-lib")
            System.loadLibrary("node")
        }

        @JvmStatic
        fun sendMessageToApplication(channelName: String, msg: String) {
            val startTime = System.nanoTime()

            if (channelName == SYSTEM_CHANNEL) {
                handleAppChannelMessage(msg)
                Log.d("RN_BRIDGE_PERF", "System message handled: ${(System.nanoTime() - startTime) / 1000}μs")
            } else {
                // Direct dispatch to React Native - no main thread involved
                instance?.dispatchMessage(channelName, msg, startTime)
                    ?: Log.w(TAG, "Module instance is null, message dropped")
            }
        }

        fun handleAppChannelMessage(msg: String) {
            if (msg == "ready-for-app-events") {
                nodeIsReadyForAppEvents = true
            }
        }
    }

    private fun asyncInit() {
        moduleScope.launch {
            try {
                if (wasAPKUpdated()) {
                    // Clear any existing trash before starting
                    trashDir.deleteRecursively()
                    try {
                        copyNodeJsAssets()
                    } catch (e: IOException) {
                        initCompletionDeferred.completeExceptionally(RuntimeException("Node assets copy failed", e))
                        return@launch
                    }
                    // Clear trash after successful copy
                    trashDir.deleteRecursively()
                }
                // Signal completion - whether we copied assets or not
                initCompletionDeferred.complete(Unit)
            } catch (e: Exception) {
                initCompletionDeferred.completeExceptionally(e)
            }
        }
    }


    override fun definition() = ModuleDefinition {
        Name("RNNodeJsMobile")

        OnCreate {
            // Sets the TMPDIR environment to the cacheDir, to be used in Node as os.tmpdir
            try {
                Os.setenv("TMPDIR", reactContext.cacheDir.absolutePath, true)
            } catch (e: ErrnoException) {
                e.printStackTrace()
            }

            // Register the filesDir as the Node data dir.
            registerNodeDataDirPath(filesDir.absolutePath)

            // Start message processor on dedicated thread
            startMessageProcessor()

            asyncInit()
        }

        OnActivityEntersBackground {
            // When the activity goes to background, we send a message to node.
            if (nodeIsReadyForAppEvents) {
                sendMessage(SYSTEM_CHANNEL, "pause")
            }
        }

        OnActivityEntersForeground {
            // When the activity comes back to foreground, we send a message to node.
            if (nodeIsReadyForAppEvents) {
                sendMessage(SYSTEM_CHANNEL, "resume")
            }
        }

        OnDestroy {
            // Cancel all coroutines when the module is destroyed
            moduleScope.cancel()
            messageChannel.cancel()
            nodeEventScope.cancel()
            nodeEventDispatcher.close()
        }

        Constants("EVENT_NAME" to EVENT_NAME)

        Events(EVENT_NAME)

        // Expose the methods to React Native
        Function("startNodeWithScript") { script: String, options: NodeJsOptions ->
            startNodeWithScript(script, options)
        }
        Function("startNodeProject") { mainFileName: String, options: NodeJsOptions ->
            startNodeProject(mainFileName, options)
        }
        Function("startNodeProjectWithArgs") { input: String, options: NodeJsOptions ->
            startNodeProjectWithArgs(input, options)
        }
        Function("sendMessage") { channel: String, msg: String ->
            sendMessage(channel, msg)
        }
    }

    // Called from JNI thread - dispatches message off main thread
    private fun dispatchMessage(channelName: String, msg: String, startTime: Long) {
        val enqueuedTime = System.nanoTime()

        // Try to send without blocking - should always succeed with UNLIMITED capacity
        val offered = messageChannel.trySend(
            MessageData(channelName, msg, startTime)
        ).isSuccess

        if (!offered) {
            // Fallback - shouldn't happen with unlimited channel
            Log.w(TAG, "Message channel full, using coroutine dispatch")
            nodeEventScope.launch {
                messageChannel.send(MessageData(channelName, msg, startTime))
            }
        }

        Log.d("RN_BRIDGE_PERF",
            "Message dispatched: enqueue=${(System.nanoTime() - enqueuedTime) / 1000}μs thread=${Thread.currentThread().name}")
    }

    // Message processor running on dedicated thread
    private fun startMessageProcessor() {
        nodeEventScope.launch {
            Log.i(TAG, "Message processor started on thread: ${Thread.currentThread().name}")

            for (msg in messageChannel) {
                processMessage(msg)
            }

            Log.i(TAG, "Message processor stopped")
        }
    }

    private fun processMessage(data: MessageData) {
        val processStart = System.nanoTime()

        try {
            // sendEvent is thread-safe and handles JS thread switching internally
            val params = mapOf(
                "channelName" to data.channelName,
                "message" to data.message
            )

val sendEventStart = System.nanoTime()
            sendEvent(EVENT_NAME, params)
val sendEventTime = System.nanoTime() - sendEventStart

            val totalLatency = System.nanoTime() - data.timestamp
            val processTime = System.nanoTime() - processStart

            Log.d("RN_BRIDGE_PERF",
                "Message sent: sendEvent=${sendEventTime / 1000}μs process=${processTime / 1000}μs latency=${totalLatency / 1000}μs thread=${Thread.currentThread().name}")
        } catch (e: Exception) {
            Log.e(TAG, "Error sending event: ${e.message}", e)
        }
    }

    fun startNodeWithScript(script: String, options: NodeJsOptions) {
        // A New module instance may have been created due to hot reload.
        instance = this

        if (!startedNodeAlready) {
            startedNodeAlready = true

            val redirectOutputToLogcat = options.redirectOutputToLogcat

            moduleScope.launch {
                waitForInit()
                startNodeWithArguments(
                    arrayOf("node", "-e", script),
                    "${nodeJsProjectDir.absolutePath}:${builtinModulesDir.absolutePath}",
                    redirectOutputToLogcat
                )
            }
        }
    }

    fun startNodeProject(mainFileName: String, options: NodeJsOptions) {
        // A New module instance may have been created due to hot reload.
        instance = this

        if (!startedNodeAlready) {
            startedNodeAlready = true

            val redirectOutputToLogcat = options.redirectOutputToLogcat

            moduleScope.launch {
                waitForInit()
                startNodeWithArguments(
                    arrayOf("node", File(nodeJsProjectDir, mainFileName).absolutePath),
                    "${nodeJsProjectDir.absolutePath}:${builtinModulesDir.absolutePath}",
                    redirectOutputToLogcat
                )
            }
        }
    }

    fun startNodeProjectWithArgs(input: String, options: NodeJsOptions) {
        // A New module instance may have been created due to hot reload.
        instance = this

        if (!startedNodeAlready) {
            startedNodeAlready = true

            val args = input.split(" ").toMutableList()
            val absoluteScriptPath = File(nodeJsProjectDir, args[0]).absolutePath

            // Remove script file name from arguments list
            args.removeAt(0)

            val command = mutableListOf<String>().apply {
                add("node")
                add(absoluteScriptPath)
                addAll(args)
            }

            val redirectOutputToLogcat = options.redirectOutputToLogcat

            moduleScope.launch {
                waitForInit()
                startNodeWithArguments(
                    command.toTypedArray(),
                    "${nodeJsProjectDir.absolutePath}:${builtinModulesDir.absolutePath}",
                    redirectOutputToLogcat
                )
            }
        }
    }

    fun sendMessage(channel: String, msg: String) {
        sendMessageToNodeChannel(channel, msg)
    }

    external fun registerNodeDataDirPath(dataDir: String)
    external fun getCurrentABIName(): String
    external fun startNodeWithArguments(
        arguments: Array<String>,
        modulesPath: String,
        redirectOutputToLogcat: Boolean
    ): Int
    external fun sendMessageToNodeChannel(channelName: String, msg: String)

    // Recursively copies contents of a folder in assets to a path with parallel processing
    private suspend fun copyAssetFolder(fromAssetPath: String, toDir: File): Unit = withContext(Dispatchers.IO) {
        val files = assetManager.list(fromAssetPath) ?: return@withContext

        if (files.isEmpty()) {
            // If it's a file, it won't have any assets "inside" it.
            fileCopySemaphore.withPermit {
                copyAsset(fromAssetPath, toDir)
            }
        } else {
            toDir.mkdirs()
            // Process subdirectories and files in parallel
            val copyJobs = files.map { file ->
                async {
                    this@RNNodeJsMobileModule.copyAssetFolder("$fromAssetPath/$file", File(toDir, file))
                }
            }
            copyJobs.awaitAll()
        }
    }

    private suspend fun copyAsset(fromAssetPath: String, toFile: File) = withContext(Dispatchers.IO) {
        try {
            assetManager.open(fromAssetPath).use { inputStream ->
                toFile.also { it.parentFile?.mkdirs() }.outputStream().buffered().use { outputStream ->
                    inputStream.copyTo(outputStream, DEFAULT_BUFFER_SIZE)
                }
            }
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }


    private suspend fun waitForInit() {
        // Wait for initialization to complete, handling both success and failure
        initCompletionDeferred.await()
    }

    private suspend fun wasAPKUpdated(): Boolean = withContext(Dispatchers.IO) {
        val prefs = reactContext.getSharedPreferences(SHARED_PREFS, Context.MODE_PRIVATE)
        previousLastUpdateTime = prefs.getLong(LAST_UPDATED_TIME, 0)

        try {
            val packageInfo = reactContext.packageManager.getPackageInfo(reactContext.packageName, 0)
            lastUpdateTime = packageInfo.lastUpdateTime
        } catch (e: PackageManager.NameNotFoundException) {
            e.printStackTrace()
        }
        return@withContext lastUpdateTime != previousLastUpdateTime
    }

    private suspend fun saveLastUpdateTime() = withContext(Dispatchers.IO) {
        val prefs = reactContext.getSharedPreferences(SHARED_PREFS, Context.MODE_PRIVATE)
        prefs.edit().apply {
            putLong(LAST_UPDATED_TIME, lastUpdateTime)
            apply()
        }
    }


    private suspend fun copyNativeAssetsFrom(): Boolean = withContext(Dispatchers.IO) {
        return@withContext try {
            // Load the additional asset folder and files lists in parallel
            val nativeDirsDeferred = async { readFileFromAssets("$nativeAssetsPath/dir.list") }
            val nativeFilesDeferred = async { readFileFromAssets("$nativeAssetsPath/file.list") }

            val nativeDirs = nativeDirsDeferred.await()
            val nativeFiles = nativeFilesDeferred.await()

            // Copy additional asset files to project working folder
            if (nativeFiles.isNotEmpty()) {
                Log.v(TAG, "Building folder hierarchy for $nativeAssetsPath")
                nativeDirs.forEach { dir ->
                    File(nodeJsProjectDir, dir).mkdirs()
                }
                Log.v(TAG, "Copying assets using file list for $nativeAssetsPath")

                // Copy files in parallel with limited concurrency
                val copyJobs = nativeFiles.map { file ->
                    async {
                        fileCopySemaphore.withPermit {
                            val src = "$nativeAssetsPath/$file"
                            copyAsset(src, File(nodeJsProjectDir, file))
                        }
                    }
                }
                copyJobs.awaitAll()
            } else {
                Log.v(TAG, "No assets to copy from $nativeAssetsPath")
            }
            true
        } catch (e: IOException) {
            e.printStackTrace()
            false
        }
    }

    private suspend fun copyNodeJsAssets() = withContext(Dispatchers.IO) {
        // If a previous project folder is present, move it to the trash.
        if (nodeJsProjectDir.exists()) {
            nodeJsProjectDir.renameTo(trashDir)
        }

        // Load the nodejs project's folder and file lists in parallel
        val dirsDeferred = async { readFileFromAssets("dir.list") }
        val filesDeferred = async { readFileFromAssets("file.list") }

        val dirs = dirsDeferred.await()
        val files = filesDeferred.await()

        // Copy the nodejs project files to the application's data path.
        if (dirs.isNotEmpty() && files.isNotEmpty()) {
            Log.d(TAG, "Node assets copy using pre-built lists")

            // Create directories first (sequential - they're dependencies)
            dirs.forEach { dir ->
                File(filesDir, dir).mkdirs()
            }

            // Copy files in parallel with limited concurrency
            val fileCopyJobs = files.map { file ->
                async {
                    fileCopySemaphore.withPermit {
                        copyAsset(file, File(filesDir, file))
                    }
                }
            }
            fileCopyJobs.awaitAll()
        } else {
            Log.d(TAG, "Node assets copy enumerating APK assets")
            copyAssetFolder(NODEJS_PROJECT_DIR, nodeJsProjectDir)
        }

        // Run native assets and builtin modules copy in parallel
        val nativeAssetsJob = async { copyNativeAssetsFrom() }
        val builtinModulesJob = async {
            // Do the builtin-modules copy too.
            // Delete any previous built-in modules folder
            builtinModulesDir.deleteRecursively()
            // Copy the nodejs built-in modules to the application's data path.
            copyAssetFolder("builtin_modules", builtinModulesDir)
        }

        nativeAssetsJob.await()
        builtinModulesJob.await()

        saveLastUpdateTime()
        Log.d(TAG, "Node assets copy completed successfully")
    }

    private suspend fun readFileFromAssets(filename: String): List<String> = withContext(Dispatchers.IO) {
        return@withContext try {
            assetManager.open(filename).use { inputStream ->
                inputStream.bufferedReader().useLines { lines ->
                    lines.toList()
                }
            }
        } catch (_: FileNotFoundException) {
            Log.d(TAG, "File not found: $filename")
            emptyList()
        } catch (e: IOException) {
            e.printStackTrace()
            emptyList()
        } catch (e: Exception) {
            // Fallback for any other unexpected exceptions
            Log.e(TAG, "Unexpected error reading file: $filename", e)
            emptyList()
        }
    }
}
