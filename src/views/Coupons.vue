<template>
<Loading :active="isLoading"></Loading>
<div class="text-end">
  <button class="btn btn-primary" type="button"
  @click="openEditModal">
  新增優惠券
  </button>
</div>
  <table class="table mt-4">
  <thead>
    <tr>
      <th width="80">優惠券名稱</th>
      <th width="80">折扣</th>
      <th width="80">到期日</th>
      <th width="80">是否啟用</th>
      <th width="80">編輯</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in products" :key="item.id">
      <td>{{item.category}}</td>
      <td class="text-right">
        {{ $filters.currency(item.origin_price) }}
      </td>
      <td class="text-right">
        {{ $filters.currency(item.price) }}
      </td>
      <td>
        <span class="text-success" v-if="item.is_enabled">啟用</span>
        <span class="text-muted" v-else>未啟用</span>
      </td>
      <td>
        <div class="btn-group">
          <button class="btn btn-outline-primary btn-sm" @click="openEditModal(item)">使用</button>
          <button class="btn btn-outline-danger btn-sm" @click="openDeleteModal(item)">刪除</button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
<Pagination :pages="pagination" @update-page="getProducts"></Pagination>
<ProductModal ref="productModal" :product="tempProduct"
@update-product="updateProduct"></ProductModal>
<DelModal :item="tempProduct" ref="delModal" @del-item="checkDeleteItem"></DelModal>
</template>

<script>
import ProductModal from '@/components/ProductModal.vue';
import DelModal from '@/components/DelModal.vue';
import Pagination from '@/components/Pagination.vue';

export default {
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      productComponent: {},
      delModalComponent: {},
      isLoading: false,
    };
  },
  inject: ['emitter'],
  created() {
    this.getProducts();
  },
  mounted() {
    this.productComponent = this.$refs.productModal;
    this.delModalComponent = this.$refs.delModal;
  },
  components: {
    ProductModal,
    DelModal,
    Pagination,
  },
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`;
      this.$http.get(api)
        .then((res) => {
          this.isLoading = false;
          console.log(res);
          if (res.data.success) {
            console.log('取得商品列表成功');
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          } else {
            console.log('取得商品列表失敗');
          }
        });
    },
    openEditModal(item = {}) {
      this.tempProduct = item;
      this.productComponent.showModal();
    },
    updateProduct(item) {
      // 新增商品
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`;
      let httpMethod = 'post';

      // 編輯商品
      this.products.forEach((data) => {
        if (data.id === item.id) {
          api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;
          httpMethod = 'put';
        }
      });

      this.tempProduct = item;
      this.$http[httpMethod](api, { data: this.tempProduct }).then(
        (response) => {
          console.log('按下新增或編輯');
          console.log(response);
          this.productComponent.hideModal();
          if (response.data.success) {
            this.emitter.emit('push-message', {
              style: 'success',
              title: '更新成功',
            });
            this.getProducts();
          } else {
            this.emitter.emit('push-message', {
              style: 'danger',
              title: '更新失敗',
              content: response.data.message.join(','),
            });
          }
        },
      );
    },
    openDeleteModal(item) {
      this.tempProduct = item;
      console.log(this.tempProduct);
      this.delModalComponent.showModal();
    },
    checkDeleteItem() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
      this.$http.delete(api).then(
        (response) => {
          console.log(response);
          this.delModalComponent.hideModal();
          this.getProducts();
        },
      );
    },
  },
};
</script>
