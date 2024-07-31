<template>
  <div class="container-fluid mt-3 position-relative">
    <h1 style="color: grey; background-color: lightyellow">
      未來盒子 TheFutureBox 用戶端
    </h1>
  </div>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/user/cart">產品列表與購物車</router-link>
    </div>
  </nav>
  <div class="container-fluid mt-3 position-relative">
    <router-view />
  </div>
  <div style="
  position: fixed; /* 固定在屏幕上 */
  top: 50%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 將元素移到中心 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 確保在其他元素之上 */
  min-width: 500px; /* 最小寬度 */
   ">
  <ToastMessage></ToastMessage>
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
