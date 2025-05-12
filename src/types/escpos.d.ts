declare module 'escpos' {
    // █████████████████████████████████████████████████████████████████████████████████████
    // ██ واجهة الجهاز الأساسية مع الدوال الإلزامية
    // █████████████████████████████████████████████████████████████████████████████████████
    interface Device {
      open(callback?: (error?: Error) => void): void;
      write(data: Buffer, callback?: (error?: Error) => void): void;
      close(callback?: () => void): void;
      vendorId?: number;
      productId?: number;
    }
  
    // █████████████████████████████████████████████████████████████████████████████████████
    // ██ فئة الطابعة الرئيسية مع التوثيق الكامل
    // █████████████████████████████████████████████████████████████████████████████████████
    export class Printer<T extends Device = Device> {
      constructor(device: T);
  
      // ─── أوامر النص الأساسية ───────────────────────────────────────────────────────
      text(content: string): this;
      encode(encoding: 'UTF-8' | 'ASCII' | 'CP437' | 'CP864' | 'CP1256' | string): this;
      align(position: 'lt' | 'ct' | 'rt'): this;
      font(font: 'A' | 'B'): this;
      size(width: number, height: number): this;
      style(style: 'b' | 'u' | 'i' | 'bu' | 'normal'): this;
      lineSpace(height?: number): this;
      feed(lines?: number): this;
      cut(partial?: boolean): this;
      close(): this;
  
      // ─── أوامر متقدمة ──────────────────────────────────────────────────────────────
      qrcode(content: string, version?: number, level?: 'L' | 'M' | 'Q' | 'H'): this;
      barcode(
        code: string,
        type: 'EAN13' | 'CODE128' | 'CODE39',
        options?: { width?: number; height?: number; position?: 'BELOW' | 'ABOVE' }
      ): this;
      image(
        image: Buffer,
        density?: 'd8' | 'd24' | 'd32',
        callback?: (error?: Error) => void
      ): this;
  
      // ─── جداول مخصصة ───────────────────────────────────────────────────────────────
      tableCustom(
        columns: Array<{ 
          text: string; 
          width?: number; 
          align?: 'LEFT' | 'CENTER' | 'RIGHT'; 
          style?: 'B' | 'A' 
        }>
      ): this;
    }
  
    // █████████████████████████████████████████████████████████████████████████████████████
    // ██ تعريفات الأجهزة المدعومة
    // █████████████████████████████████████████████████████████████████████████████████████
    export class USB implements Device {
      constructor(vid?: number, pid?: number);
      open(callback?: (error?: Error) => void): void;
      write(data: Buffer, callback?: (error?: Error) => void): void;
      close(callback?: () => void): void;
      vendorId?: number;
      productId?: number;
    }
  
    export class Console implements Device {
      constructor(handler?: any);
      open(callback?: (error?: Error) => void): void;
      write(data: Buffer, callback?: (error?: Error) => void): void;
      close(callback?: () => void): void;
    }
  
    export class Network implements Device {
      constructor(address: string, port?: number);
      open(callback?: (error?: Error) => void): void;
      write(data: Buffer, callback?: (error?: Error) => void): void;
      close(callback?: () => void): void;
    }
  
    // █████████████████████████████████████████████████████████████████████████████████████
    // ██ دوال مساعدة وثوابت
    // █████████████████████████████████████████████████████████████████████████████████████
    export const VERSION: string;
    export const SCREEN: {
      COLOR: {
        BLACK: 0x00;
        RED: 0x01;
      };
    };
    
    export function discover(
      type: 'usb' | 'network' | 'bluetooth',
      options?: { timeout?: number }
    ): Promise<Device[]>;
}