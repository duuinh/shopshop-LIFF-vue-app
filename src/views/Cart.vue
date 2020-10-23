<template>
  <div>
    <div style="padding: 1em;">
        <table class="table">
  <thead>
    <tr>
      <th>product_name</th>
      <th>size</th>
      <th>color</th>
      <th>qty</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>38</td>
      <td>23</td>
      <td>12</td>
    </tr>
  </tbody>
</table>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
export default {
  name: 'Cart',
  components: {
  },
  data:()=>({
    imageUrl: 'https://bulma.io/images/placeholders/128x128.png'
  }),
  async beforeCreate() {
    this.$liff.ready();
  },
  async created(){
    this.productId = this.$route.query.product_id;
    this.customerId = this.$route.query.customer;
    await this.getItem()
  },
  methods:{

  },
};
</script>

<style>

</style>