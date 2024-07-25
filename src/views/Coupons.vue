<template>
<Loading :active="isLoading"></Loading>
<div class="text-end">
  <button class="btn btn-primary" type="button"
  @click="openEditModal('')">
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
    <tr v-for="item in coupons" :key="item.id">
      <td>{{item.title}}</td>
      <td class="text-right">
        {{ item.percent }}%
      </td>
      <td class="text-right">
        {{ $filters.date(item.due_date) }}
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
<Pagination :pages="pagination" @update-page="getCoupons"></Pagination>
<CouponModal ref="couponModal" :coupon="tempCoupons"
@update-coupons="updateCoupons"></CouponModal>
<DelModal :item="tempCoupons" ref="delModal" @del-item="checkDeleteItem"></DelModal>
</template>

<script>
import CouponModal from '@/components/CouponModal.vue';
import DelModal from '@/components/DelModal.vue';
import Pagination from '@/components/Pagination.vue';

export default {
  data() {
    return {
      coupons: [],
      pagination: {},
      tempCoupons: {
      },
      couponComponent: {},
      delModalComponent: {},
      isLoading: false,
    };
  },
  inject: ['emitter'],
  created() {
    this.getCoupons();
  },
  mounted() {
    this.couponComponent = this.$refs.couponModal;
    this.delModalComponent = this.$refs.delModal;
  },
  components: {
    CouponModal,
    DelModal,
    Pagination,
  },
  methods: {
    getCoupons(page = 1) {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupons?page=${page}`;
      this.$http.get(api)
        .then((res) => {
          this.isLoading = false;
          console.log(res);
          if (res.data.success) {
            console.log('取得優惠券列表成功');
            this.coupons = res.data.coupons;
            this.pagination = res.data.pagination;
            console.log(this.pagination);
          } else {
            console.log('取得優惠券列表失敗');
          }
        });
    },
    openEditModal(item) {
      if (item === '') {
        this.tempCoupons = {
          due_date: new Date().getTime() / 1000,
          is_enabled: 0,
        };
      } else {
        this.tempCoupons = { ...item };
      }

      this.couponComponent.showModal();
    },
    updateCoupons(item) {
      // 新增優惠券
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon`;
      let httpMethod = 'post';
      let title = '新增優惠券';

      // 編輯優惠券
      this.coupons.forEach((data) => {
        if (data.id === item.id) {
          api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${item.id}`;
          httpMethod = 'put';
          title = '編輯優惠券';
        }
      });

      this.tempCoupons = item;
      this.$http[httpMethod](api, { data: this.tempCoupons }).then(
        (response) => {
          this.$httpMessageState(response, title);
          console.log('按下新增或編輯');
          console.log(response);
          this.couponComponent.hideModal();
          this.getCoupons();
        },
      );
    },
    openDeleteModal(item) {
      this.tempCoupons = { ...item };
      this.delModalComponent.showModal();
    },
    checkDeleteItem() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupons.id}`;
      this.$http.delete(api).then(
        (response) => {
          console.log(response);
          this.delModalComponent.hideModal();
          this.getCoupons();
        },
      );
    },
  },
};
</script>
