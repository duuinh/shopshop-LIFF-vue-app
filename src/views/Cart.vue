<template>
    <div style="padding: 1em;">
        <table class="table is-hoverable is-fullwidth">
        <thead>
            <tr>
            <th></th>
            <th>Product</th>
            <th>Price</th>
            <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(value, key) in items">
            <td>{{value.qty}}x</td>
            <td>
                <span class="tag is-danger is-light">{{value.product_name}}</span>
                <span class="tag is-rounded">{{value.color}}</span>
                <span class="tag is-rounded">{{value.size}}</span>
            </td>
            <td><strong>{{value.price}}</strong></td>
            <td><a class="tag is-delete" @click="onRemove(key)"></a></td>
            </tr>
            <tr>
            <p v-if="itemsLength==0">Your cart is empty</p>
            </tr>
        </tbody>
        </table>
        <p  class="field is-grouped is-grouped-right">
           <strong>Total: ฿{{totalPrice}}</strong>
        </p>
        <div class="field is-grouped is-grouped-right">
                        <p class="control">
                        <a class="button is-danger" @click="checkOut()" v-show="!isCheckOut" :disabled="itemsLength == 0">
                            Checkout
                        </a>
                        <button class="button is-danger is-loading" v-show="isCheckOut">Loading</button>
                        </p>
                        <p class="control">
                        <a class="button is-light" @click="continueShopping()" :disabled="isCheckOut">
                            Continue Shopping
                        </a>
                        </p>
        </div>
    </div>
</template>

<script>
const axios = require('axios');
import Vue from 'vue'

export default {
  name: 'Cart',
  components: {
  },
  data:()=>({
    imageUrl: 'https://bulma.io/images/placeholders/128x128.png',
    items: [],
    isCheckOut: false,
  }),
  async beforeCreate() {
    this.$liff.ready();
  },
  async created(){
    this.customerId = this.$route.query.customer;
    await this.getCart();
  },
  computed:{
      itemsLength(){
          return Object.keys(this.items).length;
      },
      totalPrice(){
          let price = 0;
          Object.entries(this.items).forEach(function([key, value]) {
            price +=value.price;
          });
          return price;
      },
  },
  methods:{
      async getCart(){
        // let url = 'http://localhost:8000/api/orders/cart'
        let url = 'https://shopvisor.azurewebsites.net/api/orders/cart'
        let resp = await axios.get(url, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
            },
            params: {
            customer_id: this.customerId,
            }
        });
        console.log(resp.data);
        this.items = resp.data;
      },
      async onRemove(key) {
          await this.changeStatus("canceled", key);
          Vue.delete(this.items, key)
      },
      async changeStatus(status, key){
        let row = key + 2;
        let url = 'https://shopvisor.azurewebsites.net/api/orders/status';
        let resp = await axios.post(url, null, {
            params: {
                row: row,
                status: status
            }
        });
        console.log(resp);
      },
      sendMessage(message) {
        this.$liff.sendMessages([{
        type: 'text',
        text: message
       },
       ]).catch(function (error) {
         window.alert('Error sending message: ' + error);
       });
      },
      closeWindow () {
        this.$liff.closeWindow();
      },
      checkOut() {
          if(this.itemsLength == 0) {
              return;
          }
          this.isCheckOut = true;
      },
      async continueShopping(){
          if(this.isCheckOut) {
              return;
          }
          await this.sleep(500);
          this.sendMessage('หมวดหมู่สินค้า');
          this.closeWindow();
      },
  },
};
</script>

<style>

</style>