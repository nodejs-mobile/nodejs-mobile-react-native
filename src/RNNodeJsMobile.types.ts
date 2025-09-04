export type NodeJsMessageEventPayload = {
  channelName: string;
  message: string;
};

export type NodeJsOptions = {
  redirectOutputToLogcat?: boolean;
};

export type RNNodeJsMobileModuleEvents = {
  "nodejs-mobile-react-native-message": (
    params: NodeJsMessageEventPayload
  ) => void;
};
