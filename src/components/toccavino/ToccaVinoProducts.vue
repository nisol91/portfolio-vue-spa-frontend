<template>
  <div class="ecommerceBox">
    <div class="eHeader">
      <div class="eTitle">wine shop</div>
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
          {{ product.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { db } from "../../main";
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      env: "_test",
      products: [],
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
  width: 20%;
  height: 200px;
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