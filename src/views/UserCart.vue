<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <Loading :active="isLoading"></Loading>
  <div class="container">
    <div class="row mt-4">
      <div class="col-md-7">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products" :key="item.id">
              <td style="width: 200px">
                <div
                  style="
                    height: 100px;
                    background-size: cover;
                    background-position: center;
                  "
                  :style="{ backgroundImage: `url(${item.imageUrl})` }"
                ></div>
              </td>
              <td>
                <a href="#" class="text-dark">{{ item.title }}</a>
              </td>
              <td>
                <div class="h5" v-if="!item.price">
                  {{ item.origin_price }} 元
                </div>
                <del class="h6" v-if="item.price"
                  >原價 {{ item.origin_price }} 元</del
                >
                <div class="h5" v-if="item.price">
                  現在只要 {{ item.price }} 元
                </div>
              </td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="getProductDetail(item.id)"
                  >
                    查看更多
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    @click="addToCart(item.id)"
                    :disabled="this.status.loadingItem === item.id"
                  >
                    <div
                      v-if="this.status.loadingItem === item.id"
                      class="spinner-border spinner-border-sm text-warning"
                      role="status"
                    >
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    加到購物車
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 購物車列表 -->
       <div class="col-md-5">
        <div class="sticky-top">
          <table class="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style="width: 120px">數量</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
            <template v-if="cart.carts">
              <tr v-for="item in cart.carts" :key="item.id">
                <td>
                  <button type="button" class="btn btn-outline-danger btn-sm"
                          :disabled="status.loadingItem === item.id"
                          @click="removeCartItem(item.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
                <td>
                  {{ item.product.title }}
                  <div class="text-success" v-if="item.coupon">
                    已套用優惠券
                  </div>
                </td>
                <td>
                  <div class="input-group input-group-sm">
                    <input type="number" class="form-control"
                          v-model.number="item.qty" min="1"
                          @change="updateCart(item)"
                          :disabled="this.status.loadingItem === item.id">
                    <div class="input-group-text">/ {{ item.product.unit }}</div>
                  </div>
                </td>
                <td class="">
                  <div class="">原價：{{ $filters.currency(item.total) }}</div>
                  <div v-if="cart.final_total !== cart.total" class="text-success">
                    折扣： {{ $filters.currency(item.final_total) }}
                  </div>
                </td>
              </tr>
            </template>
            </tbody>
            <tfoot>
            <tr>
              <td colspan="3" class="text-end">原價總計：</td>
              <td class="text-end">{{ $filters.currency(cart.total) }}</td>
            </tr>
            <tr v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-end text-success">折扣總計：</td>
              <td class="text-end text-success">{{ $filters.currency(cart.final_total) }}</td>
            </tr>
            <tr v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-end text-success">最終結帳金額：</td>
              <td class="text-end text-success">
                {{ $filters.currency(cart.total - cart.final_total) }}
              </td>
            </tr>
            </tfoot>
          </table>
          <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="addCouponCode"
              :disabled="this.status.loadingItem === 'on'">
                套用優惠碼
              </button>
              <button class="btn btn-outline-secondary" type="button" @click="cancelCouponCode"
              :disabled="this.status.loadingItem === 'on'">
                取消優惠碼
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      products: [],
      status: {
        loadingItem: '',
      },
      cart: [],
    };
  },
  created() {
    this.getProducts();
    this.getCarts();
  },
  methods: {
    getProducts(page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products?page=${page}`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        if (res.data.success) {
          console.log('客戶商品列表 取得成功', res.data);
          this.products = res.data.products;
        } else {
          console.log('客戶商品列表 取得失敗');
        }
        this.isLoading = false;
      });
    },
    getProductDetail(id) {
      this.$router.push(`/user/product/${id}`);
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
          console.log('加入購物車成功', res.data.data);
          this.getCarts();
        } else {
          console.log('加入購物車失敗');
        }
        this.status.loadingItem = '';
      });
    },
    getCarts() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.$http.get(api).then((res) => {
        if (res.data.success) {
          console.log('取得購物車資訊成功', res.data.data);
          this.cart = res.data.data;
        } else {
          console.log('取得購物車資訊失敗');
        }
      });
    },
    updateCart(item) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
      const cart = {
        product_id: item.product_id,
        qty: item.qty,
      };
      this.status.loadingItem = item.id;
      this.$http.put(api, { data: cart }).then((res) => {
        if (res.data.success) {
          console.log('更新購物車資訊成功', res);
          this.getCarts();
        } else {
          console.log('更新購物車資訊失敗');
        }
        this.status.loadingItem = '';
      });
    },
    removeCartItem(itemId) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${itemId}`;
      this.status.loadingItem = itemId;
      this.$http.delete(api).then((res) => {
        if (res.data.success) {
          console.log('刪除產品成功');
          this.getCarts();
        } else {
          console.log('刪除產品失敗');
        }
        this.status.loadingItem = '';
      });
    },
    addCouponCode() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`;
      const coupon = {
        code: this.coupon_code,
      };
      this.status.loadingItem = 'on';
      this.$http.post(api, { data: coupon }).then((res) => {
        if (res.data.success) {
          console.log('加入優惠券成功');
          this.getCarts();
        } else {
          console.log('加入優惠券失敗');
        }
        this.status.loadingItem = '';
      });
    },
    cancelCouponCode() {
      console.log('功能尚未開啟');
    },
  },
};
</script>
