// Reexport the native module. On web, it will be resolved to RNNodeJsMobileModule.web.ts
// and on native platforms to RNNodeJsMobileModule.ts
export { default } from "./RNNodeJsMobileModule";
export * from "./RNNodeJsMobile.types";
