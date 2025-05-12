import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import * as escpos from 'escpos';
import USB from 'escpos-usb';
(escpos as any).USB = USB;
import EscposConsole from 'escpos-console';

let win: BrowserWindow | null;
let tray: Tray | null = null;

console.log('🚀 main.ts: Electron بدأ العمل');

function createWindow() {
  win = new BrowserWindow({
    width: 1500,
    height: 900,
    icon: path.join(__dirname, '../../src/assets/img/logo_brandk_icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,  // إلغاء nodeIntegration في الواجهة
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:3000');

  win.on('closed', () => {
    win = null;
  });
}

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
  } catch (error) {
    console.error('Error loading tray icon:', error);
  }

  createWindow();

  // ✅ التحقق من وجود تحديثات
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    win?.webContents.send('update_available');
  });

  autoUpdater.on('update-downloaded', () => {
    win?.webContents.send('update_downloaded');
  });

  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });

  // ✅ استقبال الطلبات للطباعة من واجهة المستخدم
  ipcMain.on('print-invoice', (event, payload) => {
    const { invoice, items } = payload;
    const device = new escpos.USB();
    //const device = new EscposConsole();
    device.open(() => {
      const printer = new escpos.Printer(device);

      const store = invoice.store?.name || 'اسم المتجر';
      const branch = invoice.branch?.name || 'الفرع';
      const user = invoice.user?.name || 'العميل';
      const code = invoice.order_code || '';
      const total = invoice.final_sum || 0;
      const currency = invoice.currency?.code || '';
      const date = invoice.created_at || new Date().toLocaleDateString('ar-EG');

      const padRight = (text = '', length = 42) => text.padStart(length, ' ');

      printer
        .encode('CP864') // أفضل ترميز للطابعات العربية
        .align('rt')     // محاذاة لليمين
        .text(padRight('فاتورة مبيعات'))
        .text(padRight('--------------------------------'))
        .text(padRight(`المتجر: ${store}`))
        .text(padRight(`الفرع: ${branch}`))
        .text(padRight(`العميل: ${user}`))
        .text(padRight(`التاريخ: ${date}`))
        .text(padRight(`رقم الطلب: ${code}`))
        .text(padRight('--------------------------------'))
        .text(padRight(`المنتج         الكمية     السعر`));

      items.forEach((item: any) => {
        const name = item.product?.product_name || '---';
        const qty = item.quantity || 0;
        const price = item.price || 0;
        const totalLine = (qty * price).toFixed(2);

        const line = `${name.padEnd(18)}${String(qty).padEnd(8)}${totalLine.padStart(10)}`;
        printer.text(padRight(line));
      });

      printer
        .text(padRight('--------------------------------'))
        .text(padRight(`الإجمالي: ${total} ${currency}`))
        .feed(2)  // إضافة مسافة بين الفاتورة والباركود
        .barcode(`الإجمالي: ${total} ${currency}`, 'EAN13')  // تحديد نوع الباركود ورقمه
        .feed(2)  // إضافة مسافة إضافية بعد الباركود
        .cut()  // قطع الورق
        .close();  // إغلاق الاتصال
    });
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
