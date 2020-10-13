<template>
  <div>
    <div style="padding: 1em;">
        <article class="media">
            <div class="media-left">
                <figure class="image is-64x64">
                    <img id="pictureUrl" src="https://bulma.io/images/placeholders/128x128.png">
                </figure>
            </div>
            <div class="media-content">
                <div class="content">
                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                        <label class="label">Product</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                                <p class="control">
                                <input class="input" id="product-id" v-model="productId" type="text" disabled>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="field is-horizontal">

                        <div class="field-label is-normal">
                        <label class="label">Qty</label>
                        </div>

                        <div class="field-body">
                            <div class="quantity field has-addons is-left">
                                <p class="control">
                                  <button class="button" @click="minusQty()">-</button>
                                </p>
                                <p class="control">
                                    <input class="input" id="qty" v-model="qty" type="number">
                                </p>
                                <p class="control">
                                    <button class="button" @click="plusQty()">+</button>
                                </p>
                            </div>
                        </div>
                    </div>


                    <div class="field is-grouped is-grouped-left">
                        <div class="control">
                            <div class="field">
                                <label class="label">Size</label>
                                <div class="field">
                                    <div class="control">
                                        <div class="select is-danger">
                                            <select v-model="selectedSize">
                                                <option v-for="size in sizes" :key="size">{{size}}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="control"></div>

                        <div class="control">
                            <div class="field">
                                <label class="label">Color</label>
                                <div class="control">
                                    <div class="select is-danger">
                                        <select v-model="selectedColor">
                                            <option v-for="color in colors" :key="color">{{color}}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="field is-grouped is-grouped-right">
                        <p class="control">
                        <a class="button is-danger" @click="addToCart()" v-show="!isAdded">
                            Add to Cart
                        </a>
                        <button class="button is-danger is-loading" v-show="isAdded">Loading</button>
                        </p>
                        <p class="control">
                        <a class="button is-light" @click="cancel()" :disabled="isAdded">
                            Cancel
                        </a>
                        </p>
                    </div>
                </div>
            </div>
        </article>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
export default {
  name: 'AddToCart',
  components: {
  },
  data:()=>({
    colors: ['Red','Green','Blue'],
    sizes: ['S','M','L','XL'],
    qty: 1,
    customerId: 'unknown',
    productId: 'unknown',
    selectedSize: 'S',
    selectedColor: 'Red',
    isAdded: false,
  }),
  async beforeCreate() {
    this.$liff.ready();
  },
  created(){
    this.productId = this.$route.query.product;
    this.customerId = this.$route.query.customer;
  },
  methods:{
    minusQty() {
      if (this.qty > 1) {
        this.qty--;
      } 
      else {
        this.qty = 1;
      }
    },
    plusQty() {
      this.qty++;
    },
    closeWindow () {
      this.$liff.closeWindow();
    },
    async addToCart () {
      this.isAdded = true;
      // let url = 'http://192.168.43.201:8000/api/orders/place-order';
      let url = 'https://shopvisor.azurewebsites.net/api/orders/place-order';
      this.sendMessage('เพิ่ม '+this.productId+' ในตะกร้าสินค้า');
      await axios.get(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        params: {
          customer_id: this.customerId,
          product_id: this.productId,
          size: this.selectedSize,
          color: this.selectedColor,
          qty: this.qty,
        }
      });
      // await this.sleep(2000);
      this.closeWindow();
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    cancel() {
      if (this.isAdded) {
        return;
      }
      this.sendMessage('ไม่เอาดีกว่า');
      this.closeWindow();
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
  },
};
</script>

<style>

</style>