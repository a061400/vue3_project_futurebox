<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1"
 aria-labelledby="exampleModalLabel" aria-hidden="true"
 ref="modal">

<div class="modal-dialog modal-xl" role="document">
  <div class="modal-content border-0">
    <div class="modal-header bg-dark text-white">
      <h5 class="modal-title" id="exampleModalLabel">
        <span>新增產品</span>
      </h5>
      <button type="button" class="btn-close"
              data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-sm-8">
          <div class="mb-3">
            <label for="title" class="form-label">名稱</label>
            <input type="text" class="form-control" id="title"
                    placeholder="請輸入名稱" v-model="tempCoupons.title">
          </div>

          <div class="row gx-2">
            <div class="mb-3 col-md-6">
              <label for="unit" class="form-label">折扣</label>
              <input type="number" class="form-control" id="unit"
                      placeholder="請輸入折扣" v-model.number="tempCoupons.percent">
            </div>
          </div>

          <div class="row gx-2">
            <div class="mb-3 col-md-6">
              <label for="origin_price" class="form-label">到期日</label>
              <input type="date" class="form-control" id="origin_price"
                      placeholder="請輸入到期日" v-model="due_date">
            </div>
            <div class="mb-3 col-md-6">
              <label for="price" class="form-label">優惠碼</label>
              <input type="text" class="form-control" id="price"
                      placeholder="請輸入編號" v-model="tempCoupons.code">
            </div>
          </div>
          <hr>
          <div class="mb-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled"
                      v-model="tempCoupons.is_enabled">
              <label class="form-check-label" for="is_enabled">
                是否啟用
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary"
              data-bs-dismiss="modal">取消
      </button>
      <button type="button" class="btn btn-primary"
      @click="$emit('update-coupons',tempCoupons)">確認</button>
    </div>
  </div>
</div>
</div>
</template>

<script>
import modalMixin from '@/mixins/modalMixin';

export default {
  data() {
    return {
      tempCoupons: {},
      due_date: '',
    };
  },
  props: {
    coupon: {
      type: Object,
      default() { return {}; },
    },
  },
  watch: {
    coupon() {
      this.tempCoupons = this.coupon;
      const dateAndTime = new Date(this.tempCoupons.due_date * 1000)
        .toISOString().split('T');
      [this.due_date] = dateAndTime;
    },
    due_date() {
      this.tempCoupons.due_date = Math.floor(new Date(this.due_date) / 1000);
    },
  },
  mixins: [
    modalMixin,
  ],
  methods: {
  },
};
</script>
