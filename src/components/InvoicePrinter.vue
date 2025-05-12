<template>
  <div class="card p-4">
    <h2 class="text-center">فاتورة بيع</h2>
    <div v-if="invoice" id="print-section">
      <p><strong>رقم الطلب:</strong> {{ invoice.order_code }}</p>
      <p><strong>المستخدم:</strong> {{ invoice.user }}</p>
      <p><strong>المتجر - الفرع:</strong> {{ invoice.store }} - {{ invoice.branch }}</p>
      <p><strong>طريقة الدفع:</strong> {{ invoice.payment_method }}</p>
      <p><strong>الحالة:</strong> {{ invoice.status }}</p>
      <p><strong>تاريخ الإنشاء:</strong> {{ invoice.created_at }}</p>

      <h5 class="mt-4">طلبات العميل</h5>
      <table class="table table-striped" v-if="invoiceItems.length > 0">
        <thead>
          <tr>
            <th>المنتج</th>
            <th>الكمية</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cr in invoiceItems" :key="cr.id">
            <td>{{ cr.product?.product_name || 'بدون اسم' }}</td>
            <td>{{ cr.quantity }}</td>
            <td>{{ cr.price }}</td>
          </tr>
        </tbody>
      </table>
      <p><strong>الإجمالي قبل الخصم:</strong> {{ invoice.subtotal }}</p>
      <p><strong>خصم المنتجات:</strong> {{ invoice.total_discount }}</p>
      <p><strong>خصم الكوبون:</strong> {{ invoice.coupon_discount }}</p>
      <p><strong>الإجمالي النهائي:</strong> {{ invoice.final_sum }}</p>
    </div>

    <div v-else class="text-center text-muted">
      لا توجد بيانات للعرض
    </div>

    <div class="mt-4 text-center">
      <button class="btn btn-primary" @click="printInvoice">🖨️ طباعة</button>
      <button class="btn btn-primary" @click="printTable">🖨️ طباعة عبر الويب</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue';

// تعريف واجهة عنصر الطلب الفرعي بما يتناسب مع البيانات الواردة
interface InvoiceItem {
  id: number;
  quantity: number;
  price: number;
  product: { product_name: string };
}

const props = defineProps<{
  invoice: Record<string, any> | null;
  invoiceItems?: InvoiceItem[];
}>();

// الفاتورة (الكائن الكامل)
const invoice = computed(() => props.invoice);

// بنود الفاتورة: إما من الخاصية invoiceItems أو من invoice.customer_requests
const invoiceItems = computed<InvoiceItem[]>(() => {
  if (props.invoiceItems) return props.invoiceItems;
  const arr = invoice.value?.customer_requests;
  return Array.isArray(arr)
    ? arr.map((cr: any) => ({
        id: cr.id,
        quantity: cr.quantity,
        price: cr.price,
        product: { product_name: cr.product?.product_name || '' }
      }))
    : [];
});

const printTable = () => {
  const printContent = document.getElementById('print-section')?.innerHTML;
  if (!printContent) return;

  const win = window.open('', '', 'width=900,height=650');
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>طباعة الطلبات</title>
        <style>
          @media print {
            @page {
              size: 80mm auto; /* العرض 80mm، الطول تلقائي */
              margin: 0;
            }
            body {
              font-family: sans-serif;
              padding: 5px;
              direction: rtl;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: center;
            }
            th {
              background-color: #f5f5f5;
            }
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        <h2>فاتورة المبيعات</h2>
        ${printContent}
      </body>
    </html>
  `);
  win.document.close();
};

function printInvoice() {
  try {
    // التأكد من إرسال البيانات بشكل بسيط (مصفوفات أو كائنات تحتوي على نصوص وأرقام فقط)
    const payload = {
      invoice: {
        store: invoice.value.store?.name || 'اسم المتجر',
        branch: invoice.value.branch?.name || 'الفرع',
        user: invoice.value.user?.name || 'العميل',
        order_code: invoice.value.order_code || '',
        final_sum: invoice.value.total || 0,  // إجمالي الفاتورة
        currency: {
          code: invoice.value.currency?.code || 'العملة',  // العملة
        },
        created_at: invoice.value.created_at || new Date().toLocaleDateString('ar-EG'),  // تاريخ الفاتورة
      },
      items: invoiceItems.value.map(item => ({
        product: item.product?.product_name || 'منتج غير محدد',  // اسم المنتج
        quantity: item.quantity || 0,  // الكمية
        price: item.price || 0,  // السعر
      })),
    };


    (window as any).electronAPI.printInvoice(payload);
    alert('جاري الطباعة...');
  } catch (error) {
    alert('خطأ في إرسال أمر الطباعة:', error);
    console.error('خطأ في إرسال أمر الطباعة:', error);
  }
}
</script>

<style scoped>
.card {
  max-width: 600px;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 1rem;
}
</style>
