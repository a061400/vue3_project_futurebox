<template>
  <div class="container-fluid mt-3 position-relative">
    <h1 style="color: grey; background-color: lightyellow">
      未來盒子 TheFutureBox 用戶端
    </h1>
  </div>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/user/cart">取得產品列表</router-link>
    </div>
  </nav>
  <div class="container-fluid mt-3 position-relative">
    <ToastMessage></ToastMessage>
    <router-view />
  </div>
</template>

<script>
import ToastMessage from '@/components/ToastMessage.vue';
import emitter from '@/methods/emitter';

export default {
  components: {
    ToastMessage,
  },

  created() {},

  // 讓所有內層元件皆可以使用
  provide() {
    return {
      emitter,
    };
  },
};
</script>
