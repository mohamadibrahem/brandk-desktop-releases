declare module 'escpos-usb' {
    interface USBDevice {
      vendorId: number;
      productId: number;
    }
  
    class USB {
      constructor();
      open(device?: USBDevice, callback?: (error: Error | null) => void): void;
      write(data: Buffer, callback?: (error: Error | null) => void): void;
      close(callback?: (error: Error | null) => void): void;
    }
  
    export = USB;
}