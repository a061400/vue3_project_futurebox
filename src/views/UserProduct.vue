<template>
  <Loading :active="isLoading"></Loading>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/user/cart">產品列表與購物車</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ product.title }}
        </li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <article class="col-8">
        <h2>{{ product.title }}</h2>
        <div>{{ product.content }}</div>
        <div>{{ product.description }}</div>
        <img :src="product.imageUrl" alt="" class="img-fluid mb-3" />
      </article>
      <div class="col-4">
        <div class="h5" v-if="!product.price">
          {{ product.origin_price }} 元
        </div>
        <del class="h6" v-if="product.price"
          >原價 {{ product.origin_price }} 元</del
        >
        <div class="h5" v-if="product.price">
          現在只要 {{ product.price }} 元
        </div>
        <hr />
        <button
          type="button"
          class="btn btn-outline-danger"
          @click="addToCart(product.id)"
          :disabled="this.status.loadingItem === product.id"
        >
          <div
            v-if="this.status.loadingItem === product.id"
            class="spinner-border spinner-border-sm text-warning"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
          加到購物車
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: {},
      id: '',
      status: {
        loadingItem: '',
      },
    };
  },
  created() {
    this.id = this.$route.params.productId;
    this.getProduct();
  },
  methods: {
    getProduct() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/product/${this.id}`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        if (res.data.success) {
          console.log('用戶端 點擊的商品取得成功', res.data);
          this.product = res.data.product;
        } else {
          console.log('用戶端 點擊的商品取得失敗');
        }
        this.isLoading = false;
      });
    },
    addToCart(itemId) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      const cart = {
        product_id: itemId,
        qty: 1,
      };
      this.status.loadingItem = itemId;
      this.$http.post(api, { data: cart }).then((res) => {
        if (res.data.success) {
          console.log('用戶端 在獨立商品頁面 加入購物車成功', res.data.data);
        } else {
          console.log('用戶端 在獨立商品頁面 加入購物車失敗');
        }
        this.status.loadingItem = '';
      });
    },
  },
};
</script>
