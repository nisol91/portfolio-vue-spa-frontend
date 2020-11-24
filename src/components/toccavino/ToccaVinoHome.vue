<template>
  <div class="tWineBox">
    <div class="d-flex justify-content-between">
      <h1>t-wine</h1>
      <router-link class="btn nav-button" :to="{ name: 'toccaVinoAddEvent' }">
        <div class="btn btn-secondary">add your own wine event</div>
      </router-link>
      <router-link class="btn nav-button" :to="{ name: 'toccaVinoPayment' }">
        <div class="btn btn-secondary">support us</div>
      </router-link>
    </div>

    <h3>wine events, cellars and ecommerce</h3>
    <success-banner
      v-if="bannerEventName"
      :bannerEventName="bannerEventName"
    ></success-banner>

    <h6 class="tv-map border-top border-bottom">
      <mapbox-map :events="wineEvents"></mapbox-map>
    </h6>
    <v-tabs>
      <v-tab @click="getEvents('wineEvents')">Events</v-tab>
      <v-tab @click="getEvents('cellars')">Cellars</v-tab>
    </v-tabs>

    <v-overlay :value="overlayPicker"
      ><div @click="overlayPicker = !overlayPicker">
        <i class="fas fa-times closeMonthPicker"></i>
      </div>
      <v-date-picker v-model="picker" type="month"></v-date-picker
    ></v-overlay>
    <h6 class="tv-searchBar filtersBox">
      <div>
        <div>Search your event - cellar</div>
        <input
          type="text"
          v-model="searchValue"
          class="form-control searchBarWine"
          @keyup="searchEvent(searchValue)"
        />
      </div>
      <div>
        <div class="btn btn-secondary sorterBtn" @click="sortPrice">
          sort by price
        </div>
        <div class="btn btn-secondary sorterBtn" @click="sortName">
          sort by name
        </div>
        <div
          class="btn btn-secondary sorterBtn"
          @click="overlayPicker = !overlayPicker"
        >
          sort by month
        </div>
      </div>
    </h6>

    <div v-if="loading" class="splash-box">
      <v-progress-circular
        :size="70"
        color="primary"
        indeterminate
        class="splash-box-progress"
      ></v-progress-circular>
    </div>
    <div v-if="!loading">
      <transition-group name="flip-list">
        <div
          class="pt-2 border-top tv-wineEventCard"
          v-for="event in wineEventsFiltered"
          :key="event.name"
        >
          <div class="d-flex justify-content-between">
            <span>{{ event.name }}</span>
            <span>{{ event.city }}</span>
            <span v-if="event.price" class="priceWine">${{ event.price }}</span>
            <span v-if="event.type" class="priceWine">{{ event.type }}</span>
          </div>
          <div class="mt-4 descImgMainBox">
            <v-img
              v-if="event.media"
              :src="event.media[0]"
              class="grey lighten-2 mainImg"
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
            <div class="mt-4">{{ event.description }}</div>
          </div>
        </div>
      </transition-group>
      <!-- <div class="navigatePagination d-flex justify-content-between">
                <i class="fas fa-angle-left freccia" @click="pagePrev"></i>
                <i class="fas fa-angle-right freccia" @click="pageNext"></i>
            </div> -->
    </div>
    <tocca-vino-footer></tocca-vino-footer>
  </div>
</template>

<script>
import ToccaVinoFooter from "../toccavino/ToccaVinoFooter";
import _ from "lodash";
import { db } from "../../main";

export default {
  components: {
    ToccaVinoFooter: ToccaVinoFooter,
  },
  data() {
    return {
      // currentPagePagination: 1,
      overlayPicker: false,
      picker: new Date().toISOString().substr(0, 10),
      bannerEventName: this.$route.params.eventName,
      searchValue: null,
      loading: false,
      wineEvents: null,
      wineEventsFiltered: null,
      sorting: {
        price: false,
        name: false,
      },
    };
  },
  created() {
    this.$store.commit("toggleHomePage", false);

    this.getEvents("wineEvents");
  },
  methods: {
    async getEvents(type) {
      this.loading = true;
      this.wineEvents = null;
      db.collection(type)
        .get()
        .then((querySnapshot) => {
          // console.log(querySnapshot);
          const wineEvents = querySnapshot.docs.map((doc) => doc.data());
          // console.log(wineEvents);
          this.wineEvents = wineEvents;
          // sorting wineEvents on the base of 'in_evidence' field
          this.wineEvents = _.orderBy(
            this.wineEvents,
            [
              function (ev) {
                return ev.in_evidence;
              },
            ],
            ["desc"]
          );
          //mi serve per i filtri
          this.wineEventsFiltered = this.wineEvents;

          this.loading = false;
        })
        .catch((error) => {
          this.errors = error.response && error.response.data.errors;
        });
    },

    // eventuale pagination
    pageNext() {
      this.currentPagePagination += 1;
      //  console.log(this.currentPagePagination);
      this.getEvents();
    },
    pagePrev() {
      if (this.currentPagePagination != 1) {
        this.currentPagePagination -= 1;
        //   console.log(this.currentPagePagination);

        this.getEvents();
      }
    },
    searchEvent(val) {
      this.wineEventsFiltered = _.filter(this.wineEvents, function (o) {
        return (
          o.name.includes(val) ||
          o.city.includes(val) ||
          (o.price && o.price.toString().includes(val))
        );
      });
      //    console.log(this.wineEventsFiltered);
    },
    sortPrice() {
      if (this.sorting.price) {
        this.wineEventsFiltered = _.reverse(
          _.sortBy(this.wineEventsFiltered, ["price"])
        );
        this.sorting.price = false;
      } else {
        this.wineEventsFiltered = _.sortBy(this.wineEventsFiltered, ["price"]);
        this.sorting.price = true;
      }
    },
    sortName() {
      if (this.sorting.name) {
        this.wineEventsFiltered = _.reverse(
          _.sortBy(this.wineEventsFiltered, ["name"])
        );
        this.sorting.name = false;
      } else {
        this.wineEventsFiltered = _.sortBy(this.wineEventsFiltered, ["name"]);
        this.sorting.name = true;
      }
    },
  },
  computed: {},
};
</script>

<style scoped>
.tv-searchBar {
  margin: 50px 0;
}
.tv-map {
  margin: 50px 0;
  height: 400px;
  width: 100%;
}
.tv-wineEventCard {
  margin: 50px 0;
}
.flip-list-move {
  transition: transform 1s;
}
.freccia {
  font-size: 20px;
  cursor: pointer;
}
.descImgMainBox {
  display: flex;
  justify-content: space-between;
}

.mainImg {
  max-width: 200px;
}
.sorterBtn {
  margin: 20px;
}
.priceWine {
  font-size: 25px;
  font-weight: bold;
}
.searchBarWine {
  width: 30vw;
  margin: 10px;
}
.filtersBox {
  display: flex;
  justify-content: space-between;
}
.closeMonthPicker {
  font-size: 25px;
  margin: 20px;
  cursor: pointer;
}
</style>
