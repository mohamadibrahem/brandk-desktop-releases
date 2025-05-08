<template>
    <div class="pagetitle">
      <h1>لوحة التحكم</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item active">إضافة فاتورة</li>
        </ol>
      </nav>
    </div>
    <section class="section">
      <div class="alert alert-info" v-if="isOffline" variant="warning" show>
        <p>أنت الآن في وضع أوفلاين، سيتم حفظ المبيعات محليًا حتى توفر الاتصال بالإنترنت.</p>
      </div>
  
      <b-card>
        <h3 class="mb-3">عملية البيع</h3>
  
        <b-form-group label="إدخال SKU أو اسم المنتج">
          <b-input-group>
            <b-form-input
              v-model="sku"
              @keyup.enter="searchProduct"
              @input="updateSku"
              placeholder="أدخل SKU أو اسم المنتج"
              autocomplete="off"
            />
            <b-button variant="primary" @click="addProductBySku">
              أضف المنتج
            </b-button>
            <BButton @click="showScanner = true">مسح QR Code</BButton>
          </b-input-group>
        </b-form-group>
  
        

        <BModal
            v-model="showScanner"
            title="مسح QR Code"
            hide-footer
            size="lg"
            @shown="onModalShown"
            @hidden="onModalHidden"
        >
            <!-- الآن نستخدم QrcodeStream عوض QrReader -->
            <template v-if="scannerActive">
            <qrcode-stream
                :formats="['qr_code','code_128']"
                :videoProps="{ style: 'filter: grayscale(1) contrast(2)' }"
                :mirror="false"
                @init="onInit"
                @decode="onDecode"
                @error="onError"
                :paused="false"
                style="width:100%;"
            />
            </template>

            <template #modal-footer>
            <BButton variant="secondary" @click="showScanner = false">
                إغلاق
            </BButton>
            </template>
        </BModal>
        
        <div v-if="product" class="alert alert-info">
          {{ product.product_name }} — السعر: {{ product.price }} 
          <b-button variant="success" @click="addProductToCart(product)">
            إضافة إلى السلة
          </b-button>
        </div>
  
        <div v-if="cart.length" class="mt-4">
          <h4>السلة</h4>
          <b-list-group>
            <b-list-group-item
              v-for="item in cart"
              :key="item.id"
              class="d-flex justify-content-between align-items-center"
            >
              <div>
                {{ item.product_name }} — السعر: {{ item.price }} 
                <br />
                الكمية:
                <b-button
                  size="sm"
                  variant="outline-secondary"
                  @click="decreaseQuantity(item)"
                >
                  –
                </b-button>
                {{ item.quantity }}
                <b-button
                  size="sm"
                  variant="outline-secondary"
                  @click="increaseQuantity(item)"
                >
                  +
                </b-button>
              </div>
              <b-button
                size="sm"
                variant="danger"
                @click="removeFromCart(item)"
              >
                حذف
              </b-button>
            </b-list-group-item>
          </b-list-group>
  
          <div class="mt-3 d-flex">
            <p class="mx-3">
              <strong>الإجمالي قبل الخصم:</strong>
              {{ totals.originalTotal.toFixed(2) }} 
            </p>
            <p class="mx-3">
              <strong>خصم المنتجات:</strong>
              -{{ totals.productDiscounts.toFixed(2) }} 
            </p>
            <p class="mx-3">
              <strong>خصم الكوبون:</strong>
              -{{ totals.couponDiscount.toFixed(2) }} 
            </p>
            <p class="font-weight-bold mx-3">
              <strong>الإجمالي بعد الخصم:</strong>
              {{ totals.finalTotal.toFixed(2) }} 
            </p>
          </div>
        </div>
  
        <div v-if="coupons.length && cart.length" class="mt-4">
          <h4>الكوبونات المتاحة</h4>
          <b-button-group horizontal>
            <b-button class="mx-2"
              v-for="c in coupons"
              :key="c.id"
              variant="outline-success"
              @click="applyCoupon(c)"
            >
              {{ c.code }} ({{ c.discount_amount }} {{ c.reward_type }})
            </b-button>
          </b-button-group>
        </div>
  
        <b-button
          class="mt-4"
          variant="primary"
          :disabled="cart.length === 0"
          @click="submitSale"
        >
          إتمام البيع
        </b-button>
      </b-card>
    </section>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import {
    calculateDiscounts,
    // you can also import individual utilities if needed
  } from '@/services/discountService.js'
  import { Product } from '@/store/modules/products'

    
  import { BModal, BButton, BAlert } from 'bootstrap-vue-3'
  import { QrcodeStream } from 'vue-qrcode-reader'
  
  export default defineComponent({
    name: 'SalePage',
    setup() {
      const store = useStore()
  
      const sku = ref('')
      const product = ref<Product | null>(null)
      const cart = ref<Array<Product & { quantity: number }>>([])
      const isOffline = ref(!navigator.onLine)
      const appliedCoupon = ref<any>(null)
  
      const products = computed(() => store.getters['products/getProducts'])
      const coupons = computed(() => store.state.coupons.coupons)

      // دالة لتحديث القيمة عند الكتابة
        function updateSku() {
        // يمكن هنا إضافة أي معالجة أخرى إذا احتجت لها
        }
  
      // نبني هيكل الـ cart ليوافق ما تتوقعه خدمة الخصومات
      const cartItemsForCalc = computed(() =>
        cart.value.map(item => ({
          id: item.id,
          product: {
            id: item.id,
            price: item.price,
            discount_price: parseFloat(item.discount_price || '0'),
            product_name: item.product_name,
            // إذا تستخدم حقول إضافية في isCouponValidForItem:
            // categoryId, subCategoryId, ownerId
          },
          quantity: item.quantity,
        }))
      )
  
      // نحسب كل المجموعات بضغطة واحدة
      const totals = computed(() =>
        calculateDiscounts(cartItemsForCalc.value, appliedCoupon.value)
      )

      const showScanner   = ref(false)
    const scannerActive = ref(false)

    function onModalShown()  { scannerActive.value = true }
    function onModalHidden() { scannerActive.value = false }

    function onInit(p: Promise<any>) {
      p.catch(err => console.warn('QR init failed', err))
    }

    function onError(err: Error) {
      console.error('QR reader error', err)
    }

    // عند قراءة رمز بنجاح
    const onDecode = (decodedString: string) => {
        if (navigator.vibrate) {navigator.vibrate(200);} 
      showScanner.value = false
      sku.value = decodedString.trim()
      searchProduct()       // نبحث عن المنتج بناءً على الـ SKU الممسوح
      if (product.value) {
        addProductToCart(product.value)
      } else {
        alert('المنتج غير موجود')
      }
    }
  
      const increaseQuantity = (item: any) => {
        item.quantity++
      }
      const decreaseQuantity = (item: any) => {
        if (item.quantity > 1) item.quantity--
        else removeFromCart(item)
      }
      const removeFromCart = (item: any) => {
        cart.value = cart.value.filter(p => p.id !== item.id)
      }
  
      const fetchData = async () => {
        await store.dispatch('products/fetchProducts')
        await store.dispatch('coupons/fetchCoupons')
      }
  
      const searchProduct = () => {
        if (!products.value.length) return
        const found = products.value.find(
          (p: Product) =>
            p.product_name.trim().toLowerCase() === sku.value ||
            p.sku === sku.value
        )
        product.value = found || null
        addProductBySku();
      }
  
      const addProductBySku = () => {
        if (product.value) addProductToCart(product.value)
        else alert('المنتج غير موجود'); sku.value = '';
      }
  
      const addProductToCart = (prod: Product) => {
        const existing = cart.value.find(it => it.id === prod.id)
        if (existing) existing.quantity++
        else cart.value.push({ ...prod, quantity: 1 })
        sku.value = ''
        product.value = null
      }
  
      const applyCoupon = (cup: any) => {
        appliedCoupon.value = cup
      }
  
      const submitSale = async () => {
        try {
          await store.dispatch('sales/submitSale', {
            items: cart.value,
            coupon: appliedCoupon.value?.code || null,
          })
          alert(isOffline.value ? 'تم حفظ المبيعات محليًا' : 'تم إتمام البيع بنجاح')
          cart.value = []
          appliedCoupon.value = null
        } catch {
          alert('حدث خطأ أثناء إرسال الطلب')
        }
      }
  
      const scanQRCode = () => {
        alert('يرجى استخدام مكتبة QR لتمكين هذه الميزة.')
      }
  
      window.addEventListener('online', () => (isOffline.value = false))
      window.addEventListener('offline', () => (isOffline.value = true))
  
      onMounted(fetchData)
  
      return {
        showScanner,
        scannerActive,
        onModalHidden,
        onModalShown,
        sku,
        product,
        cart,
        coupons,
        isOffline,
        onInit,
        onDecode,
        onError,
        totals,
        searchProduct,
        addProductToCart,
        addProductBySku,
        applyCoupon,
        submitSale,
        scanQRCode,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
      }
      
    },
  })
  </script>
  
<style scoped>
  .font-weight-bold {
    font-weight: bold;
  }
  video {
    transform: none !important;
    }
</style>
  