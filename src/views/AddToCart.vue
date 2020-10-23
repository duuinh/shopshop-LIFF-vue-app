<template>
  <div>
    <div style="padding: 1em;">
        <article class="media">
            <div class="media-left">
                <figure class="image is-64x64">
                    <img id="pictureUrl" :src="imageUrl" width="128" height="128">
                    <strong>
                    <center>฿{{this.totalPrice}}</center>
                    </strong>
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
                                <span class="tag is-danger is-light is-medium" id="product-id">{{productName}}</span>
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
                                  <input class="input has-text-centered" id="qty" v-model="qty" type="number" readonly>
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
                        <a class="button is-danger" @click="addToCart()" v-show="!isAdded" :disabled="productName == 'unknown'">
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
    price: 0,
    totalPrice: 0,
    customerId: 'unknown',
    productName: 'unknown',
    productId: 'unknown',
    selectedSize: 'S',
    selectedColor: 'Red',
    isAdded: false,
    imageUrl: 'https://bulma.io/images/placeholders/128x128.png',
    source: null,
  }),
  async beforeCreate() {
    this.$liff.ready();
  },
  async created(){
    this.productId = this.$route.query.product_id;
    this.customerId = this.$route.query.customer;
    this.source = this.$route.query.source;
    await this.getItem()
  },
  methods:{
    minusQty() {
      if (this.qty > 1) {
        this.qty--;
        this.totalPrice = this.qty * this.price;
      } 
      else {
        this.qty = 1;
        this.totalPrice = this.qty * this.price;
      }
    },
    plusQty() {
      this.qty++;
      this.totalPrice = this.qty * this.price;
    },
    closeWindow () {
      this.$liff.closeWindow();
    },
    async getItem () {
      // let url = `http://192.168.43.201:8000/api/items/${this.productId}`;
      let url = `https://shopvisor.azurewebsites.net/api/items/${this.productId}`;
      let response = await axios.get(url);
      console.log(response.data);
          this.productName = response.data.name;
          if (!this.colors.includes(response.data.color)) {
            this.colors.push(response.data.color);
          }
          this.selectedColor = response.data.color;
          this.imageUrl = response.data.img_url;
          this.price = response.data.price;
          this.totalPrice = response.data.price;
    },
    async addToCart () {
      if (this.productName == 'unknown') {
        return;
      }
      this.sendMessage('เพิ่ม '+this.productName+' ในตะกร้าสินค้า');
      this.isAdded = true;
      // let url = 'http://192.168.43.201:8000/api/orders/place-order';
      let url = 'https://shopvisor.azurewebsites.net/api/orders/place-order';
      axios.post(url, null,{
        params: {
          customer_id: this.customerId,
          product_id: this.productId,
          product_name: this.productName,
          size: this.selectedSize,
          color: this.selectedColor,
          qty: this.qty,
          price: this.totalPrice,
          source: this.source
        }
      });
      await this.sleep(1500);
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