import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import http from 'http';
import * as escpos from 'escpos';
import USB from 'escpos-usb';
(escpos as any).USB = USB;
import EscposConsole from 'escpos-console';

let win: BrowserWindow | null = null;
let tray: Tray | null = null;

console.log('🚀 main.ts: Electron بدأ العمل');

const DEV_URL = 'http://127.0.0.1:3000/'; // استخدم 127.0.0.1 لتجنّب مشاكل localhost

function waitForServer(url: string, timeout = 20000, interval = 250) {
  const end = Date.now() + timeout;
  return new Promise<void>((resolve, reject) => {
    (function check() {
      const req = http.request(url, { method: 'HEAD' }, res => {
        // أي استجابة تعتبر OK
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() > end) return reject(new Error('server did not respond in time'));
        setTimeout(check, interval);
      });
      req.end();
    })();
  });
}

function createWindow() {
  if (win && !win.isDestroyed()) {
    // لو النافذة موجودة إرجاعها للظهور
    try {
      win.show();
      win.focus();
    } catch (e) {
      console.warn('could not focus existing window', e);
    }
    return;
  }

  win = new BrowserWindow({
    width: 1500,
    height: 900,
    icon: path.join(__dirname, '../../src/assets/img/logo_brandk_icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // في وضع التطوير: انتظر السيرفر ثم حمّل الصفحة مع retries على did-fail-load
  (async () => {
    if (process.env.NODE_ENV === 'development' || process.env.ELECTRON_START_URL) {
      try {
        await waitForServer(DEV_URL, 20000, 300);
      } catch (err) {
        console.warn('Dev server did not respond in time, attempting to load anyway:', err);
      }
      const url = DEV_URL;
      win!.loadURL(url).catch((err) => {
        console.error('loadURL failed:', err);
      });

      win!.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.error('did-fail-load', { errorCode, errorDescription, validatedURL });
        // محاولة إعادة تحميل بعد تأخير صغير (يمكن التحكم بعدد المحاولات لو رغبت)
        setTimeout(() => {
          if (win && !win.isDestroyed()) {
            win.loadURL(validatedURL).catch(e => console.error('retry loadURL failed:', e));
          }
        }, 2000);
      });
    } else {
      // الإنتاج: حمّل ملف محلي مبني
      try {
        win.loadFile(path.join(__dirname, "../../dist/index.html"));
      } catch (e) {
        console.error('Failed to load file in production mode:', e);
      }
    }
  })();

  win.on('closed', () => {
    win = null;
  });
}

// helpers لطباعة نص بمحاذاة وفصل الأعمدة
const pad = {
  left: (text = '', length = 42) => text.toString().padStart(length, ' '),
  right: (text = '', length = 42) => text.toString().padEnd(length, ' '),
  // تنسيق سطر: اسم (18) | كمية (8) | سعر(10)
  lineItem: (name = '', qty = '', price = '') => {
    const n = name.toString().slice(0, 18).padEnd(18, ' ');
    const q = qty.toString().padEnd(8, ' ');
    const p = price.toString().padStart(10, ' ');
    return `${n}${q}${p}`;
  }
};

app.whenReady().then(() => {
  try {
    tray = new Tray(path.join(__dirname, '../../src/assets/img/logo_brandk_icon.ico'));

    tray.setToolTip('BRANDK ONLINE');

    tray.setContextMenu(Menu.buildFromTemplate([
      {
        label: 'Open App',
        click: () => createWindow()
      },
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ]));

    tray.on('double-click', () => createWindow());
    tray.on('click', () => {
      // toggle/show the window
      if (win && !win.isDestroyed()) {
        try {
          win.isVisible() ? win.hide() : (win.show(), win.focus());
        } catch (e) {
          createWindow();
        }
      } else {
        createWindow();
      }
    });
  } catch (error) {
    console.error('Error loading tray icon:', error);
  }

  createWindow();

  // فقط شغّل auto-updater في الإصدارات المعبَّأة
  if (app.isPackaged) {
    try {
      autoUpdater.checkForUpdatesAndNotify();

      autoUpdater.on('update-available', () => {
        if (win && !win.isDestroyed()) win.webContents.send('update_available');
      });

      autoUpdater.on('update-downloaded', () => {
        if (win && !win.isDestroyed()) win.webContents.send('update_downloaded');
      });
    } catch (e) {
      console.error('autoUpdater error:', e);
    }
  } else {
    console.log('Skipping autoUpdater in development (app is not packaged).');
  }

  ipcMain.on('restart_app', () => {
    try {
      autoUpdater.quitAndInstall();
    } catch (e) {
      console.error('restart_app error:', e);
    }
  });

  // طباعة الفاتورة
  ipcMain.on('print-invoice', (event, payload) => {
    try {
      const { invoice, items } = payload;
      // استخدم EscposConsole أثناء التطوير للتجريب (لن تحتاج طابعة فعلية)
      let device: any;
      try {
        device = new (escpos as any).USB(); // قد يرمي خطأ لو الطابعة غير متصلة
      } catch (e) {
        console.warn('USB device init failed, falling back to console printer:', e);
        device = new EscposConsole();
      }

      device.open((err: any) => {
        if (err) {
          console.error('Device open error:', err);
          return;
        }

        try {
          const printer = new (escpos as any).Printer(device);
          const store = invoice.store?.name || 'اسم المتجر';
          const branch = invoice.branch?.name || 'الفرع';
          const user = invoice.user?.name || 'العميل';
          const code = invoice.order_code || '';
          const total = invoice.final_sum ?? 0;
          const currency = invoice.currency?.code || '';
          const date = invoice.created_at || new Date().toLocaleString('ar-EG');

          printer
            .encode('CP864')
            .align('rt')
            .text(pad.left('فاتورة مبيعات'))
            .text(pad.left('--------------------------------'))
            .text(pad.left(`المتجر: ${store}`))
            .text(pad.left(`الفرع: ${branch}`))
            .text(pad.left(`العميل: ${user}`))
            .text(pad.left(`التاريخ: ${date}`))
            .text(pad.left(`رقم الطلب: ${code}`))
            .text(pad.left('--------------------------------'))
            .text(pad.left(`المنتج         الكمية     السعر`));

          (items || []).forEach((item: any) => {
            const name = item.product?.product_name || '---';
            const qty = item.quantity ?? 0;
            const price = (item.price ?? 0).toFixed(2);
            const line = pad.lineItem(name, qty, price);
            printer.text(line);
          });

          printer
            .text(pad.left('--------------------------------'))
            .text(pad.left(`الإجمالي: ${total} ${currency}`))
            .feed(2);

          // الباركود: تأكد أنه رقم صالح لصيغة EAN13 (12/13 رقم)
          const numericCode = (code || '').toString().replace(/\D/g, '').slice(0, 12);
          if (numericCode.length === 12) {
            printer.barcode(numericCode, 'EAN13');
            printer.feed(2);
          } else {
            // لو ليس رقمياً/غير صالح، اطبع رمز بديل أو تجاهل الباركود
            console.warn('Order code not numeric/12 digits — skipping EAN13 barcode. code:', code);
          }

          printer.cut();
          printer.close();
        } catch (e) {
          console.error('Printing error:', e);
        }
      });
    } catch (e) {
      console.error('print-invoice handler error:', e);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
