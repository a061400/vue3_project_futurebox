<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
<Loading :active="isLoading"></Loading>
  <table class="table mt-4">
  <thead>
    <tr>
      <th width="80">購買時間</th>
      <th width="120">帳號Email</th>
      <th width="400">購買物品</th>
      <th width="80">應付金額</th>
      <th width="80">是否付款</th>
      <th width="80">編輯</th>
    </tr>
  </thead>
  <tbody>
      <template v-for="(item, key) in products" :key="key">
        <tr v-if="products.length"
            :class="{'text-secondary': !item.is_paid}">
          <td>{{ $filters.date(item.create_at) }}</td>
          <td><span v-text="item.user.email" v-if="item.user"></span></td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.title }} 數量：{{ product.qty }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total }}</td>
          <td>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" :id="`paidSwitch${item.id}`"
                     v-model="item.is_paid"
                     @change="updatePaid(item)">
              <label class="form-check-label" :for="`paidSwitch${item.id}`">
                <span v-if="item.is_paid">已付款</span>
                <span v-else>未付款</span>
              </label>
            </div>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm"
                      @click="openEditModal(item)">檢視</button>
              <button class="btn btn-outline-danger btn-sm"
                      @click="openDeleteModal(item)"
              >刪除</button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
<Pagination :pages="pagination" @update-page="getProducts"></Pagination>
<OrderModal ref="orderModal" :product="tempProduct"></OrderModal>
<DelModal :item="tempProduct" ref="delModal" @del-item="checkDeleteItem"></DelModal>
</template>

<script>
import OrderModal from '@/components/OrderModal.vue';
import DelModal from '@/components/DelModal.vue';
import Pagination from '@/components/Pagination.vue';

export default {
  data() {
    return {
      products: [
      ],
      pagination: {
      },
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
    this.productComponent = this.$refs.orderModal;
    this.delModalComponent = this.$refs.delModal;
  },
  components: {
    OrderModal,
    DelModal,
    Pagination,
  },
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`;
      this.$http.get(api)
        .then((res) => {
          this.isLoading = false;
          console.log(res);
          if (res.data.success) {
            console.log('取得訂單成功');
            // this.products = res.data.products;
            // this.pagination = res.data.pagination;
            this.products = [
              {
                create_at: 1523539834,
                id: '-L9u2EUkQSoEmW7QzGLF',
                is_paid: true,
                message: '這是留言',
                paid_date: 1523539924,
                payment_method: 'credit_card',
                products: {
                  L8nBrq8Ym4ARI1Kog4t: {
                    title: '毛巾',
                    id: 'L8nBrq8Ym4ARI1Kog4t',
                    product_id: '-L8moRfPlDZZ2e-1ritQ',
                    qty: '3',
                  },
                },
                total: 100,
                user: {
                  address: 'kaohsiung',
                  email: 'test@gmail.com',
                  name: 'steven666',
                  tel: '0912346768',
                },
                num: 1,
              },
            ];
            this.pagination = {
              current_page: 1,
              has_next: false,
              has_pre: false,
              total_pages: 1,
            };
          } else {
            console.log('取得訂單失敗');
          }
        });
    },
    openEditModal(item = {}) {
      this.tempProduct = { ...item };
      this.productComponent.showModal();
    },
    openDeleteModal(item) {
      this.tempProduct = { ...item };
      console.log(this.tempProduct);
      this.delModalComponent.showModal();
    },
    checkDeleteItem() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${this.tempProduct.id}`;
      this.$http.delete(api).then(
        (response) => {
          console.log(response);
          this.delModalComponent.hideModal();
          this.getProducts();
        },
      );
    },
    updatePaid() {

    },
  },
};
</script>
