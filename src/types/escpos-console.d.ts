declare module 'escpos-console' {
    export default class Console {
      constructor(handler?: any);
      open(callback?: (error?: Error) => void): void;
      write(data: Buffer, callback?: (error?: Error) => void): void;
      close(callback?: () => void): void;
    }
  }
  