// Type declarations for 'mic' package
declare module 'mic' {
  import { Readable } from 'stream';

  interface MicOptions {
    rate?: string;
    channels?: string;
    debug?: boolean;
    exitOnSilence?: number;
  }

  interface MicInstance {
    start(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    getAudioStream(): Readable;
  }

  function mic(options?: MicOptions): MicInstance;

  export = mic;
}
