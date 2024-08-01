<template>
<div class="my-5 row justify-content-center">
  <form class="col-md-6" @submit.prevent="payOrder">
    <table class="table align-middle">
      <thead>
      <th class="text-center">品名</th>
      <th class="text-center">數量</th>
      <th class="text-center">單價</th>
      <th class="text-center">折扣</th>
      <th class="text-center">總價</th>
      </thead>
      <tbody>
      <tr v-for="(item,key) in order.products" :key="key">
        <td class="text-center">{{item.product.title}}</td>
        <td class="text-center">{{item.qty}} /
          {{item.product.unit}}</td>
        <td class="text-center">{{ $filters.currency(item.product.price)}}</td>
        <td class="text-center">
          {{ $filters.currency(item.final_total)}}
        </td>
        <td class="text-center">{{ $filters.currency(item.total - item.final_total)}}</td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td colspan="3" class="text-center">付款總額</td>
        <td class="">
          {{ $filters.currency(order.total)}}</td>
      </tr>
      </tfoot>
    </table>

    <table class="table">
      <tbody>
      <tr>
        <th width="100">Email</th>
        <td>{{order.user.email}}</td>
      </tr>
      <tr>
        <th>姓名</th>
        <td>{{order.user.name}}</td>
      </tr>
      <tr>
        <th>收件人電話</th>
        <td>{{order.user.tel}}</td>
      </tr>
      <tr>
        <th>收件人地址</th>
        <td>{{order.user.address}}</td>
      </tr>
      <tr>
        <th>付款狀態</th>
        <td>
          <span v-if="!order.is_paid">尚未付款</span>
          <span v-else class="text-success">付款完成</span>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="text-end">
      <button v-if="!order.is_paid" class="btn btn-danger">確認付款去</button>
    </div>
  </form>
</div>
</template>

<script>
export default {
  data() {
    return {
      order: {
        create_at: '',
        id: '',
        is_paid: '',
        message: '',
        payment_method: '',
        products: [
        ],
        total: '',
        user: {
          address: '',
          email: '',
          name: '',
          tel: '',
        },
      },
      id: '',
      firstKey: '',
    };
  },
  created() {
    this.id = this.$route.params.orderId;
    this.getOrder();
  },
  methods: {
    getOrder() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order/${this.id}`;
      this.$http.get(api).then((res) => {
        if (res.data.success) {
          this.order = res.data.order;

          // 沒有使用v-for時需要用到這個key來取值
          // 取得所有的key
          this.keys = Object.keys(this.order.products);
          // 假設只需要第一個key
          // eslint-disable-next-line prefer-destructuring
          this.firstKey = this.keys[0];

          console.log('用戶端 取得單筆訂單內容成功', res);
        } else {
          console.log('用戶端 取得單筆訂單內容失敗');
        }
      });
    },
    payOrder() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/pay/${this.id}`;
      this.$http.post(api).then((res) => {
        if (res.data.success) {
          this.getOrder();
          console.log('用戶端 付款成功', res);
        } else {
          console.log('用戶端 付款失敗');
        }
      });
    },
  },
};
</script>
