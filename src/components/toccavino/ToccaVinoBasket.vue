<template>
  <div class="basket">
    <div class="basketBox">
      <div class="basketProd" v-for="(item, i) in basket" :key="i + 'item'">
        <div class="basketLeft">
          <div class="prodName">
            {{ item.name }}
          </div>
          <div class="prodDescription">
            {{ item.description }}
          </div>
          <v-img
            :src="item.media[0]"
            class="grey lighten-2 prodMedia imgBasket"
            :aspect-ratio="16 / 9"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </div>

        <div class="prodPrice">{{ item.price }}€</div>
      </div>
    </div>
    <div class="checkoutBox">
      <div class="checkTop">
        <span class="prodName">Total:</span>
        <span class="prodName">{{ totalPrice }} €</span>
      </div>

      <router-link class="btn nav-button" :to="{ name: 'toccaVinoPayment' }">
        <v-btn color="primary" rounded dark depressed> checkout </v-btn>
      </router-link>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      basket: [],
    };
  },
  created() {
    this.$store.commit("toggleHomePage", false);

    this.basket = this.$store.state.basket.items;
    console.log(this.basket);
  },
  computed: {
    ...mapState({
      isLoggedIn: "isLoggedIn",
      userRole: "userRole",
      globalMessage: "globalMessage",
    }),
    totalPrice: function () {
      var totalPrice = 0;
      this.basket.forEach((el) => {
        totalPrice += el.price;
      });
      return totalPrice;
    },
  },
};
</script>
<style lang="scss">
.basket {
  display: flex;
}
.basketBox {
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.basketProd {
  width: 90%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid grey;
  padding: 10px;
  margin-bottom: 10px;
}
.basketLeft {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.checkoutBox {
  position: fixed;
  top: 100px;
  right: 10px;
  height: 150px;
  width: 30%;
  margin: 10px;
  padding: 10px;
  background: rgb(184, 184, 184);
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .checkTop {
    display: flex;
    justify-content: center;
  }
}
.imgBasket {
  width: 130px;
}
</style>