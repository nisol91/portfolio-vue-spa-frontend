<template>
  <div class="ecommerceBox">
    <div class="eHeader">
      <div class="eTitle">wine shop</div>
      <div class="eTitle">
        <v-btn
          color="primary"
          rounded
          dark
          depressed
          @click="generateFakeProducts"
        >
          Generate products
        </v-btn>
      </div>
    </div>
    <div class="eFiltersTop">filtri top</div>
    <div class="eBody">
      <div class="eFiltersLateral">filtri lateral</div>

      <div class="eProducts">
        <div
          class="eProduct"
          v-for="(product, i) in products"
          :key="i + '_prod'"
        >
          <div>
            {{ product.name }}
          </div>
          <div>
            {{ product.description }}
          </div>
          <div>
            {{ product.category }}
          </div>
          <div>
            {{ product.origin }}
          </div>
          <div>
            {{ product.year }}
          </div>
          <v-img
            :src="product.media[0]"
            class="grey lighten-2 mainImgEditing"
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
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { db, Timestamp, GeoPoint } from "../../main";
import { mapState, mapGetters } from "vuex";
import firebase from "firebase";

export default {
  data() {
    return {
      env: "_test",
      products: [],
      categories: [
        "red",
        "barrique",
        "white",
        "rose",
        "champagne",
        "italian",
        "french",
      ],
      productsFiltered: null,
      isPriceFilterActive: false,
      isNameFilterActive: false,
      isMonthFilterActive: false,
      currentTab: "wineEvents",
      chip2: true,
      overlayPicker: false,
      picker: new Date().toISOString().substr(0, 10),
      searchValue: null,
      loading: false,
      sorting: {
        price: false,
        name: false,
      },
    };
  },
  created() {
    this.$store.commit("toggleHomePage", false);
    this.getProducts();
  },
  methods: {
    generateFakeProducts() {
      for (let i = 0; i < 20; i++) {
        db.collection(`products${this.env}`).add({
          userId: firebase.auth().currentUser.uid,
          createdTimestamp: firebase.firestore.Timestamp.fromDate(new Date()),
          name: `product_${Math.floor(
            Math.random() * 10
          )}_${this.$faker().lorem.word()}`,
          category: this.categories[
            Math.floor(Math.random() * this.categories.length)
          ],
          description: this.$faker().lorem.sentence(),
          price: Math.floor(Math.random() * 30),
          year: this.$faker().random.number({
            min: 1990,
            max: 2020,
          }),
          origin: this.$faker().address.country(),
          //   media: [this.$faker().image.nature(), this.$faker().image.food()],
          media: [
            "https://picsum.photos/200/300",
            "https://picsum.photos/200/300",
          ],
          location: new GeoPoint(
            this.$faker().random.number({
              min: 5,
              max: 88,
            }),
            this.$faker().random.number({
              min: 5,
              max: 88,
            })
          ),
        });
      }
    },
    async getProducts() {
      // resetto filtri
      this.isNameFilterActive = false;
      this.isPriceFilterActive = false;
      this.isMonthFilterActive = false;

      this.loading = true;
      this.wineEvents = null;
      this.chip2 = true;
      db.collection(`products${this.env}`)
        .get()
        .then((querySnapshot) => {
          // console.log(querySnapshot);
          const products = querySnapshot.docs.map((doc) => doc.data());
          // console.log(products);
          this.products = products;
          // sorting products on the base of 'in_evidence' field
          this.products = _.orderBy(
            this.products,
            [
              function (ev) {
                return ev.in_evidence;
              },
            ],
            ["desc"]
          );
          //mi serve per i filtri
          this.productsFiltered = this.products;

          this.loading = false;
        })
        .catch((error) => {
          this.errors = error.response && error.response.data.errors;
        });
    },

    searchEvent(val) {
      this.productsFiltered = _.filter(this.products, function (o) {
        if (o.name && o.city && o.price) {
          return (
            o.name.includes(val) ||
            o.city.includes(val) ||
            (o.price && o.price.toString().includes(val))
          );
        }
      });
      //    console.log(this.productsFiltered);
    },
    selectMonth(month) {
      this.overlayPicker = !this.overlayPicker;
      this.productsFiltered = _.filter(this.products, function (o) {
        if (o.date) {
          return o.date.includes(month);
        }
      });
      console.log(this.productsFiltered);
      this.isMonthFilterActive = true;
      this.isPriceFilterActive = false;
      this.isNameFilterActive = false;
    },
    sortPrice() {
      if (this.sorting.price) {
        this.productsFiltered = _.reverse(
          _.sortBy(this.productsFiltered, ["price"])
        );
        this.sorting.price = false;
      } else {
        this.productsFiltered = _.sortBy(this.productsFiltered, ["price"]);
        this.sorting.price = true;
      }
      this.isPriceFilterActive = true;
      this.isNameFilterActive = false;
      this.isMonthFilterActive = false;
    },
    sortName() {
      if (this.sorting.name) {
        this.productsFiltered = _.reverse(
          _.sortBy(this.productsFiltered, ["name"])
        );
        this.sorting.name = false;
      } else {
        this.productsFiltered = _.sortBy(this.productsFiltered, ["name"]);
        this.sorting.name = true;
      }
      this.isNameFilterActive = true;
      this.isMonthFilterActive = false;
      this.isPriceFilterActive = false;
    },
  },
  computed: {
    ...mapState({
      isLoggedIn: "isLoggedIn",
      userRole: "userRole",
      globalMessage: "globalMessage",
    }),
  },
};
</script>
<style lang="scss">
.ecommerceBox {
  width: 100%;
  min-height: 100vh;
}
.eFiltersLateral {
  width: 20%;
  background: rgb(115, 120, 126);
}
.eFiltersTop {
  width: 100%;
  background: rgb(154, 166, 180);
}
.eHeader {
  width: 100%;
  background: rgb(177, 177, 177);
}
.eProducts {
  width: 80%;
  background: rgb(76, 80, 85);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.eProduct {
  width: 30%;
  border-radius: 3px;
  background: rgb(201, 212, 226);
  margin: 10px;
  padding: 10px;
}
.eBody {
  display: flex;
  min-height: 100%;
}
</style>