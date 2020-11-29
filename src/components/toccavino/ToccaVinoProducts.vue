<template>
  <div class="ecommerceBox">
    <div class="eHeader">
      <div class="eTitle">
        <router-link class="btn nav-button" :to="{ name: 'toccaVinoHome' }">
          <i class="fas fa-arrow-left"></i> </router-link
        >wine shop
      </div>
      <!-- <v-btn
        color="primary"
        rounded
        dark
        depressed
        @click="generateFakeProducts"
      >
        Generate fake products
      </v-btn> -->
    </div>
    <div class="eFiltersTop">
      <div>
        <div>Search your product</div>
        <input
          type="text"
          v-model="searchValue"
          class="form-control searchBarWine"
          @keyup="searchProduct(searchValue)"
        />
      </div>
      <div
        :class="{ active: isPriceFilterActive }"
        class="btn btn-secondary sorterBtn"
        @click="sortPrice"
      >
        sort by price
      </div>
      <div
        :class="{ active: isNameFilterActive }"
        class="btn btn-secondary sorterBtn"
        @click="sortName"
      >
        sort by name
      </div>
      <div
        class="btn btn-secondary sorterBtn resetFilters"
        @click="getProducts"
      >
        reset filters
      </div>
    </div>
    <div class="eBody">
      <div class="eFiltersLateral">
        <div class="latFilterTitle">CATEGORY</div>
        <div
          class="latFilterElements"
          v-for="(cat, i) in categories"
          :key="i + '_cat'"
        >
          {{ cat }}
        </div>
        <div class="latFilterTitle">YEAR</div>
        <div
          class="latFilterElements"
          v-for="(year, i) in years"
          :key="i + '_cat'"
        >
          {{ year }}
        </div>
      </div>

      <div v-if="loading" class="eProducts">
        <v-skeleton-loader
          class="eProduct"
          v-for="i in 20"
          :key="i + '_prodSkeleton'"
          type="card"
        ></v-skeleton-loader>
      </div>
      <div v-if="!loading" class="eProducts">
        <div
          class="eProduct"
          v-for="(product, i) in productsFiltered"
          :key="i + '_prod'"
        >
          <div class="prodName">
            {{ product.name }}
          </div>
          <div class="prodDescription">
            {{ product.description }}
          </div>
          <div class="prodCategory">
            {{ product.category }}
          </div>
          <div class="prodOrigin">
            {{ product.origin }}
          </div>
          <div class="prodYear">
            {{ product.year }}
          </div>
          <div class="prodYear">{{ product.price }}€</div>
          <v-img
            :src="product.media[0]"
            class="grey lighten-2 prodMedia"
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
          <v-btn
            class="addToCart"
            type="submit"
            color="primary"
            rounded
            dark
            depressed
            @click="selectDate(picker)"
          >
            add to cart
            <v-icon>mdi-cart-arrow-right</v-icon>
          </v-btn>
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
      years: [
        "2018",
        "2017",
        "2016",
        "2015",
        "2014",
        "2013",
        "2012",
        "2011",
        "2010",
        "2009",
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

    searchProduct(val) {
      this.productsFiltered = _.filter(this.products, function (o) {
        if (o.name && o.year && o.price) {
          return (
            o.name.includes(val) ||
            o.year == val ||
            (o.price && o.price.toString().includes(val))
          );
        }
      });
      //    console.log(this.productsFiltered);
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
.eTitle {
  font-size: 30px;
}
.eFiltersLateral {
  width: 20%;
  background: rgb(115, 120, 126);
  padding: 10px;
}
.eFiltersTop {
  width: 100%;
  background: rgb(154, 166, 180);
  padding: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.eHeader {
  width: 100%;
  height: 70px;
  padding: 10px;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.eBody {
  display: flex;
  min-height: 100%;
}

.prodName {
  font-size: 23px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.prodDescription {
  font-size: 17px;
  //   font-weight: bold;
}
.prodCategory {
  font-size: 22px;
  font-weight: bold;
}
.prodOrigin {
  font-size: 16px;
  //   font-weight: bold;
}
.prodYear {
  font-size: 16px;
  font-weight: bold;
}
.prodMedia {
  margin-top: 10px;
  max-height: 120px;
}
.active {
  border: 2px solid black !important;
}
.latFilterTitle {
  font-weight: bold;
  font-size: 22px;
}
.latFilterElements {
  cursor: pointer;
  font-size: 15px;
}
.addToCart {
  margin-top: 5px;
}
</style>