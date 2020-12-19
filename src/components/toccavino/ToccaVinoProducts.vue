<template>
  <div class="ecommerceBox">
    <div class="eHeader">
      <div class="eTitle">
        <router-link class="btn nav-button" :to="{ name: 'toccaVinoHome' }">
          <i class="fas fa-arrow-left"></i>
        </router-link>
        <div>wine shop</div>
        <router-link class="btn nav-button" :to="{ name: 'toccaVinoBasket' }">
          <v-icon>mdi-cart</v-icon>
          {{ itemsInBasket }}
        </router-link>
      </div>
      <v-btn
        v-if="userRole == '03746'"
        color="primary"
        rounded
        dark
        depressed
        @click="generateFakeProducts"
      >
        Generate fake products
      </v-btn>
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
      <div class="sorterBox">
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
      <div
        class="btn btn-secondary eFiltersLateralArrow included"
        @click="openSideBar = !openSideBar"
      >
        <v-icon>mdi-arrow-collapse-left</v-icon>
        <span>lateral bar filters</span>
      </div>
    </div>
    <div class="eBody">
      <div
        v-click-outside="{
          handler: onClickOutsideSideBar,
          include: include,
        }"
        class="eFiltersLateral"
        :class="{ eFiltersLateralShow: openSideBar }"
      >
        <div
          class="btn btn-secondary sorterBtn resetFilters"
          @click="getProducts"
        >
          reset filters
        </div>
        <div v-if="productsFiltered">
          Products: {{ productsFiltered.length }}
        </div>
        <div class="latFilterTitle">CATEGORY</div>
        <div
          class="latFilterElements"
          v-for="(cat, i) in categories"
          :key="i + '_cat'"
          @click="filterProdCat(cat, i)"
          :class="{
            activeFilter: activeIndexFilteredCategories.indexOf(i) !== -1,
          }"
        >
          {{ cat }}
        </div>
        <div class="latFilterTitle">YEAR</div>
        <div
          class="latFilterElements"
          v-for="(year, i) in years"
          :key="i + '_year'"
          @click="filterProdYear(year, i)"
          :class="{
            activeFilter: activeIndexFilteredYears.indexOf(i) !== -1,
          }"
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
            <span v-for="(cat, i) in product.category" :key="i + '_catz'"
              >{{ cat }}
            </span>
          </div>
          <div class="prodOrigin">
            {{ product.origin }}
          </div>
          <div class="prodYear">
            {{ product.year }}
          </div>
          <div class="prodYear">
            {{ product.wineyard }}
          </div>
          <div class="prodYear">{{ product.price }}€</div>

          <v-carousel
            :continuous="false"
            :cycle="false"
            :show-arrows="false"
            hide-delimiter-background
            delimiter-icon="mdi-minus"
            height="120"
          >
            <v-carousel-item v-for="(img, i) in product.media" :key="i + 'img'">
              <v-img
                :src="img"
                class="grey lighten-2 prodMedia"
                :aspect-ratio="16 / 9"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-carousel-item>
          </v-carousel>
          <div class="prodYear">
            <span>
              <v-icon class="actionIcon" @click="removeItem(product)"
                >mdi-minus-box</v-icon
              >
            </span>
            <span>{{ product.itemsNumber }} </span>
            <span>
              <v-icon class="actionIcon" @click="addItem(product)"
                >mdi-plus-box</v-icon
              >
            </span>
          </div>

          <v-btn
            v-if="!product.added"
            class="addToCart"
            type="submit"
            color="primary"
            rounded
            dark
            depressed
            @click="addProductToBasket(product)"
          >
            add to cart
            <v-icon>mdi-cart-arrow-right</v-icon>
          </v-btn>
          <v-btn
            v-if="product.added"
            class="addToCart"
            type="submit"
            color="primary"
            rounded
            dark
            depressed
          >
            already in cart
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
      // env: "_test",
      // env: "",
      env: process.env.VUE_APP_DB_ENV,
      openSideBar: false,
      products: [],
      filteredCategories: [],
      filteredYears: [],
      activeIndexFilteredCategories: [],
      activeIndexFilteredYears: [],
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
      fakeImg: [
        "https://firebasestorage.googleapis.com/v0/b/portfolio-f8a45.appspot.com/o/w1.jpg?alt=media&token=8d562466-3cd4-4c45-ac65-65281efd9640",
        "https://firebasestorage.googleapis.com/v0/b/portfolio-f8a45.appspot.com/o/w2.jpeg?alt=media&token=3200a207-f860-47e9-b3fb-45ba2e5df4d3",
        "https://firebasestorage.googleapis.com/v0/b/portfolio-f8a45.appspot.com/o/w3.jpeg?alt=media&token=4ef7d30a-f0fe-4e8e-b318-beabfa159774",
        "https://firebasestorage.googleapis.com/v0/b/portfolio-f8a45.appspot.com/o/w4.jpg?alt=media&token=bf53b7d6-2f3d-45f4-8207-b1fe2d22dfa7",
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
    onClickOutsideSideBar() {
      this.openSideBar = false;
    },
    include() {
      return [document.querySelector(".included")];
    },
    addItem(prod) {
      prod.itemsNumber += 1;
    },
    removeItem(prod) {
      if (prod.itemsNumber > 1) {
        prod.itemsNumber -= 1;
      }
    },
    addProductToBasket(prod) {
      this.$store.dispatch("addToBasket", prod);
    },
    generateFakeProducts() {
      for (let i = 0; i < 10; i++) {
        db.collection(`products${this.env}`).add({
          userId: firebase.auth().currentUser.uid,
          createdTimestamp: firebase.firestore.Timestamp.fromDate(new Date()),
          name: `product_${Math.floor(
            Math.random() * 10
          )}_${this.$faker().lorem.word()}`,
          wineyard: this.$faker().lorem.word(),
          category: [
            this.categories[Math.floor(Math.random() * this.categories.length)],
            this.categories[Math.floor(Math.random() * this.categories.length)],
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
            this.fakeImg[Math.floor(Math.random() * this.fakeImg.length)],
            this.fakeImg[Math.floor(Math.random() * this.fakeImg.length)],
          ],
          warehouseQuantity: this.$faker().random.number({
            min: 1,
            max: 25,
          }),
          itemsNumber: 1,
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
          const products = querySnapshot.docs.map((doc) => {
            var res = new Object(doc.data());
            res["id"] = doc.id;
            return res;
          });

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

          // controllo che sia o meno gia presente nel carrello
          this.products.forEach((prod) => {
            this.$store.state.basket.items.forEach((baskItem) => {
              if (prod.id == baskItem.id) {
                prod["added"] = true;
              }
            });
          });
          //mi serve per i filtri
          this.productsFiltered = this.products;

          // resetto varie cose
          this.filteredCategories = [];
          this.filteredYears = [];
          this.activeIndexFilteredCategories = [];
          this.activeIndexFilteredYears = [];

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
    filterProdCat(val, i) {
      if (this.filteredCategories.length == 1) {
        this.productsFiltered = this.products;
        this.activeIndexFilteredYears = [];
        this.filteredYears = [];
        this.filteredCategories.push(val);
      } else if (this.filteredCategories.indexOf(val) == -1) {
        this.filteredCategories.push(val);
      }

      var filteredProds = [];
      this.products.forEach((prod) => {
        this.filteredCategories.forEach((cat) => {
          prod.category.forEach((prCat) => {
            if (prCat == cat && !filteredProds.includes(prod)) {
              filteredProds.push(prod);
            }
          });
        });
      });
      this.activeIndexFilteredCategories.push(i);
      this.productsFiltered = filteredProds;
    },
    filterProdYear(val, i) {
      if (this.filteredYears.length == 1) {
        this.productsFiltered = this.products;
        this.activeIndexFilteredCategories = [];
        this.filteredCategories = [];
        this.filteredYears.push(val);
      } else if (this.filteredYears.indexOf(val) == -1) {
        this.filteredYears.push(val);
      }

      var filteredProds = [];
      this.products.forEach((prod) => {
        this.filteredYears.forEach((filtYear) => {
          if (prod.year == filtYear) {
            filteredProds.push(prod);
          }
        });
      });
      this.activeIndexFilteredYears.push(i);
      this.productsFiltered = filteredProds;
    },
  },
  computed: {
    ...mapState({
      isLoggedIn: "isLoggedIn",
      userRole: "userRole",
      globalMessage: "globalMessage",
    }),
    ...mapGetters({ itemsInBasket: "itemsInBasket" }),
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
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.eFiltersLateralArrow {
  margin-top: 10px !important;
  font-size: 8px !important;
  margin-left: 130px;
  display: none !important;
}
.eFiltersLateral {
  width: 20%;
  background: rgb(115, 120, 126);
  padding: 10px;
  padding-left: 20px;
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
  min-height: 70px;
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
  font-size: 18px;
  font-weight: bold;
  font-style: italic;
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
.activeFilter {
  color: blue;
}
.sorterBtn {
  margin: 0 10px;
}
</style>