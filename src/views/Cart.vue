<template>
  <div>
    <div style="padding: 1em;">
        <table class="table">
  <thead>
    <tr>
      <th></th>
      <th>Product</th>
      <th>Size</th>
      <th>Color</th>
      <th>Price</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2x</td>
      <td><span class="tag is-danger is-light">{{productName}}</span></td>
      <td>S</td>
      <td>Pink</td>
      <td><strong>120</strong></td>
      <td><a class="tag is-delete"></a></td>
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
    this.customerId = this.$route.query.customer;
    await this.getItem()
  },
  methods:{
      async getCart(){
        url = 'https://shopvisor.azurewebsites.net/api/orders/cart'
        axios.get(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        params: {
          customer_id: this.customerId,
        }
      });
      }
  },
};
</script>

<style>

</style>