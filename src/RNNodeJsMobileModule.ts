import { NativeModule, requireNativeModule, EventEmitter } from "expo";
import { type EventSubscription } from "expo-modules-core";

import {
  RNNodeJsMobileModuleEvents,
  NodeJsOptions,
} from "./RNNodeJsMobile.types";
import { serialize, deserialize } from "./MessageCodec";

declare class RNNodeJsMobileModule extends NativeModule<RNNodeJsMobileModuleEvents> {
  EVENT_NAME: string;
  /**
   * Start a Node.js script directly from a string.
   * @param script - The JavaScript code to execute
   * @param options - Optional configuration for Node.js execution
   */
  startNodeWithScript(script: string, options?: NodeJsOptions): void;

  /**
   * Start a Node.js project by specifying the main file name.
   * @param mainFileName - The main JavaScript file to execute (relative to the project directory)
   * @param options - Optional configuration for Node.js execution
   */
  startNodeProject(mainFileName: string, options?: NodeJsOptions): void;

  /**
   * Start a Node.js project with command line arguments.
   * @param input - The script file name and arguments as a space-separated string
   * @param options - Optional configuration for Node.js execution
   */
  startNodeProjectWithArgs(input: string, options?: NodeJsOptions): void;

  /**
   * Send a message to the Node.js process through a named channel.
   * @param channel - The channel name to send the message on
   * @param msg - The message to send
   */
  sendMessage(channel: string, msg: string): void;
}

// This call loads the native module object from the JSI.
const RNNodeJsMobile =
  requireNativeModule<RNNodeJsMobileModule>("RNNodeJsMobile");

const EVENT_CHANNEL = "_EVENTS_";

type EventsMap = Record<string, (...args: any[]) => void>;

/**
 * EventChannel class that supports user-defined event types with optional arguments.
 * Allows sending any serializable JavaScript object supported by JSON.stringify().
 * Includes backward-compatible 'send' method for 'message' events.
 */
class EventChannel extends EventEmitter<EventsMap> {
  #name: string;
  #listenerCount = 0;
  #subscription: any = null;

  constructor(name: string) {
    super();
    this.#name = name;
  }

  /**
   * Start native event subscription when first listener is added
   */
  #startNativeSubscription(): void {
    if (this.#subscription) return;
    this.#subscription = RNNodeJsMobile.addListener(
      "nodejs-mobile-react-native-message",
      (event) => {
        if (event.channelName !== this.#name) return;
        this.#processData(event.message);
      }
    );
  }

  /**
   * Stop native event subscription when last listener is removed
   */
  #stopNativeSubscription(): void {
    if (!this.#subscription) return;
    this.#subscription.remove();
    this.#subscription = null;
  }

  /**
   * Posts an event with optional arguments to Node.js
   * @param event - The event name
   * @param msg - Optional arguments to send with the event
   */
  post(event: string, ...msg: any[]): void {
    RNNodeJsMobile.sendMessage(this.#name, serialize(event, ...msg));
  }

  /**
   * Posts a 'message' event for backward compatibility
   * @param msg - Arguments to send with the message
   */
  send(...msg: any[]): void {
    this.post("message", ...msg);
  }

  /**
   * Processes incoming data from Node.js and emits local events
   * @param data - Serialized message envelope from Node.js
   */
  #processData(data: string): void {
    try {
      const envelope = deserialize(data);
      this.emit(envelope.event, ...envelope.payload);
    } catch (error) {
      console.warn("Failed to process Node.js message:", error);
    }
  }

  addListener(
    event: string,
    listener: (...args: any[]) => void
  ): EventSubscription {
    const subscription = super.addListener(event, listener);
    this.#listenerCount++;
    if (this.#listenerCount === 1) {
      this.#startNativeSubscription();
    }
    return {
      remove: () => {
        subscription.remove();
        this.#listenerCount--;
        if (this.#listenerCount === 0) {
          this.#stopNativeSubscription();
        }
      },
    };
  }
}

// Create the default event channel
const channel = new EventChannel(EVENT_CHANNEL);

const nodejs = {
  start(mainFileName: string, options?: NodeJsOptions) {
    if (typeof mainFileName !== "string") {
      throw new Error(
        'nodejs-mobile-react-native\'s start expects to receive the main .js entrypoint filename, e.g.: nodejs.start("main.js");'
      );
    }
    RNNodeJsMobile.startNodeProject(
      mainFileName,
      options || { redirectOutputToLogcat: true }
    );
  },
  startWithArgs(command: string, options?: NodeJsOptions) {
    if (typeof command !== "string") {
      throw new Error(
        'nodejs-mobile-react-native\'s startWithArgs expects to receive the main .js entrypoint filename and arguments, e.g.: nodejs.startWithArgs("main.js arg1 arg2");'
      );
    }
    RNNodeJsMobile.startNodeProjectWithArgs(
      command,
      options || { redirectOutputToLogcat: true }
    );
  },
  startWithScript(script: string, options?: NodeJsOptions) {
    if (typeof script !== "string") {
      throw new Error(
        "nodejs-mobile-react-native's startWithScript expects to receive the script as a string, e.g.: nodejs.startWithScript(\"console.log('Hello World');\");"
      );
    }
    RNNodeJsMobile.startNodeWithScript(
      script,
      options || { redirectOutputToLogcat: true }
    );
  },
  channel,
};

export default nodejs;
