export {};

declare global {
  interface Window {
    auth: {
      saveToken: (token: string) => Promise<void>;
      getToken: () => Promise<string | null>;
      clearToken: () => Promise<void>;
    };
    api: {
      sendMessege: (channel: string, data: any) => void;
      onReceive: (channel: string, callback: (data: any) => void) => void;
      selectFile: () => Promise<string>;
    };
  }
}
