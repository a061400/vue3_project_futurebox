<template>
  <Navbar></Navbar>
  <div class="container-fluid">
    <div class="container-fluid mt-3 position-relative">
    <ToastMessage></ToastMessage>
    <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import emitter from '@/methods/emitter';
import ToastMessage from '@/components/ToastMessage.vue';

export default {
  components: {
    Navbar,
    ToastMessage,
  },
  created() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    );
    this.$http.defaults.headers.common.Authorization = token;
    const api = `${process.env.VUE_APP_API}api/user/check`;
    this.$http.post(api, this.user).then((res) => {
      if (res.data.success) {
        console.log('登入成功');
      } else {
        this.$router.push('/login');
        console.log('驗證錯誤(cookie失效)，請重新登入');
      }
    });
  },
  // 讓所有內層元件皆可以使用
  provide() {
    return {
      emitter,
    };
  },
};
</script>
