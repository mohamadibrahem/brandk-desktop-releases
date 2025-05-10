<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const email = ref('Ibrahemnarges63@gmail.com');
const password = ref('narjes12345');
const domain = ref('narjes.brandk.online');
const error = ref('');

// منطق تسجيل الدخول
const login = async (e) => {
  e.preventDefault();
  error.value = '';
  try {
    await store.dispatch('login', { domain: domain.value, email: email.value, password: password.value });
    // بعد نجاح تسجيل الدخول، سيتم توجيه المستخدم إلى الصفحة الرئيسية
    router.push('/');
  } catch (err) {
    error.value = store.getters.getError || 'حدث خطأ في تسجيل الدخول';
  }
};
</script>

<template>
  <div class="container">
    <section class="section register d-flex flex-column align-items-center justify-content-center py-2">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-6 d-flex flex-column align-items-center justify-content-center">
            <div class="d-flex justify-content-center py-2">
              <a class="logo d-flex align-items-center w-auto" href="#">
                <img alt="logo brandk" src="@/assets/img/logo-brandk.png" />
                <span class="d-none d-lg-block">BRANDK ONLINE</span>
              </a>
            </div>

            <div class="card mb-3">
              <div class="card-body">
                <div class="pt-4 pb-2">
                  <h5 class="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                  <p class="text-center small">Enter your domain, email & password</p>
                </div>

                <form class="row g-3 needs-validation" @submit="login" novalidate>
                  <div class="col-12">
                    <label for="domain" class="form-label">Domain</label>
                    <input v-model="domain" type="text" class="form-control" id="domain" required />
                  </div>
                  <div class="col-12">
                    <label for="email" class="form-label">Email</label>
                    <input v-model="email" type="email" class="form-control" id="email" required />
                  </div>
                  <div class="col-12">
                    <label for="password" class="form-label">Password</label>
                    <input v-model="password" type="password" class="form-control" id="password" autocomplete="current-password" required />
                  </div>

                  <div class="col-12">
                    <button class="btn btn-primary w-100" type="submit">Login</button>
                  </div>

                  <div class="col-12" v-if="error">
                    <p class="text-danger small text-center mb-0">{{ error }}</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
</style>
