<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const email = ref('brandkonline@gmail.com');
const password = ref('12345678');
const domain = ref('demo.brandk.project');
const error = ref('');

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
  <div class="login-container">
    <h2>تسجيل الدخول</h2>

    <form @submit="login">
      <input v-model="domain" placeholder="الدومين" />
      <input v-model="email" placeholder="البريد الإلكتروني" />
      <input v-model="password" type="password" placeholder="كلمة المرور" autocomplete="current-password"/>
    
      <button type="submit">تسجيل الدخول</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style>
.error {
  color: red;
}
</style>
