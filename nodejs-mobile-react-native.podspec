require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.source       = { :git => 'https://github.com/nodejs-mobile/nodejs-mobile-react-native.git', :tag => "v#{s.version}" }
  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, '13.0'
  s.source_files = 'ios/*.{h,m,mm,hpp,cpp}'
  s.pod_target_xcconfig = {
    'CLANG_CXX_LANGUAGE_STANDARD' => 'gnu++17',
    'ENABLE_BITCODE' => 'NO',
    'USE_HEADERMAP' => 'NO',
    'ALWAYS_SEARCH_USER_PATHS' => 'NO',
    'HEADER_SEARCH_PATHS' => '"$(PODS_TARGET_SRCROOT)/ios" "$(PODS_TARGET_SRCROOT)/ios/libnode/include/node"'
  }
  s.user_target_xcconfig = {
    'ENABLE_BITCODE' => 'NO'
  }
  s.ios.vendored_frameworks = 'ios/NodeMobile.xcframework'
  s.static_framework = true
  s.dependency 'React-Core'
end
