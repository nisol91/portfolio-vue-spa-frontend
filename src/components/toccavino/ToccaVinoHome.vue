<template>
  <div class="tWineBox">
    <div class="d-flex justify-content-between">
      <h1>t-wine</h1>
      <router-link class="btn nav-button" :to="{ name: 'toccaVinoAddEvent' }">
        <div v-if="this.$store.state.isLoggedIn" class="btn btn-secondary">
          add your own wine event
        </div>
      </router-link>
      <router-link
        v-if="!isLoggedIn"
        class="btn nav-button"
        :to="{ name: 'register' }"
      >
        <div class="btn btn-secondary">
          register with your email to see full funcionalities
        </div>
      </router-link>
      <router-link class="btn nav-button" :to="{ name: 'toccaVinoPayment' }">
        <div class="btn btn-secondary">support us</div>
      </router-link>
      <div class="twineIconsBox">
        <router-link
          class="userIndexIcon"
          v-if="isLoggedIn"
          :to="{ name: 'userProfile' }"
          ><v-icon class="userIndexIcon"
            >mdi-account-circle</v-icon
          ></router-link
        >
        <router-link
          class="userIndexIcon"
          v-if="isLoggedIn"
          :to="{ name: 'editLists' }"
          ><v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon class="userIndexIcon" v-bind="attrs" v-on="on"
                >mdi-playlist-edit</v-icon
              >
            </template>
            <span>My lists</span>
          </v-tooltip></router-link
        >
      </div>
    </div>

    <h3>wine events, cellars and ecommerce</h3>
    <success-banner
      v-if="bannerEventName"
      :bannerEventName="bannerEventName"
    ></success-banner>

    <h6 class="tv-map border-top border-bottom">
      <mapbox-map :events="wineEvents"></mapbox-map>
    </h6>
    <router-link class="btn nav-button" :to="{ name: 'toccaVinoProducts' }">
      <div class="btn btn-secondary">
        buy wine!<v-icon class="userIndexIcon">mdi-glass-wine</v-icon>
      </div>
    </router-link>
    <v-tabs>
      <v-tab @click="getEvents('wineEvents')">Events</v-tab>
      <v-tab @click="getEvents('cellars')">Cellars</v-tab>
    </v-tabs>

    <v-overlay :value="overlayPicker"
      ><div @click="overlayPicker = !overlayPicker">
        <i class="fas fa-times closeMonthPicker"></i>
      </div>
      <v-date-picker v-model="picker" type="month"></v-date-picker>
      <div class="monthBtn">
        <v-btn
          type="submit"
          color="primary"
          rounded
          dark
          depressed
          @click="selectMonth(picker)"
        >
          SELECT
        </v-btn>
      </div>
    </v-overlay>
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
          :class="{ active: isMonthFilterActive }"
          class="btn btn-secondary sorterBtn"
          @click="overlayPicker = !overlayPicker"
        >
          sort by month
        </div>
        <div
          v-if="currentTab == 'wineEvents'"
          class="btn btn-secondary sorterBtn resetFilters"
          @click="getEvents('wineEvents')"
        >
          reset filters
        </div>
        <div
          v-if="currentTab == 'cellars'"
          class="btn btn-secondary sorterBtn resetFilters"
          @click="getEvents('cellars')"
        >
          reset filters
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
      <v-chip
        v-if="wineEventsFiltered.length === 0 && chip2"
        class="ma-2"
        close
        color="red darken-4"
        text-color="white"
        @click:close="
          chip2 = false;
          getEvents(currentTab);
        "
      >
        sorry, no events or cellars found :(
      </v-chip>
      <transition-group name="flip-list">
        <div
          class="pt-2 border-top tv-wineEventCard"
          v-for="(event, index) in wineEventsFiltered"
          :key="index + `_event`"
        >
          <div class="d-flex justify-content-between">
            <span>{{ event.name }}</span>
            <span>{{ event.city }}</span>
            <span v-if="event.date">{{
              event.date | moment("dddd, MMMM Do YYYY")
            }}</span>
            <span v-if="event.price" class="priceWine">${{ event.price }}</span>
            <span v-if="event.type" class="">{{ event.type }}</span>
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
            <div class="mt-4">{{ event.cellar }}</div>
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
import VueMoment from "vue-moment";
import { mapState, mapGetters } from "vuex";

export default {
  components: {
    ToccaVinoFooter: ToccaVinoFooter,
  },
  data() {
    return {
      // currentPagePagination: 1,
      isPriceFilterActive: false,
      isNameFilterActive: false,
      isMonthFilterActive: false,
      currentTab: "wineEvents",
      chip2: true,
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
      // resetto filtri
      this.isNameFilterActive = false;
      this.isPriceFilterActive = false;
      this.isMonthFilterActive = false;

      this.loading = true;
      this.wineEvents = null;
      this.chip2 = true;
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

          this.currentTab = type;
        })
        .catch((error) => {
          this.errors = error.response && error.response.data.errors;
        });
    },

    searchEvent(val) {
      this.wineEventsFiltered = _.filter(this.wineEvents, function (o) {
        if (o.name && o.city && o.price) {
          return (
            o.name.includes(val) ||
            o.city.includes(val) ||
            (o.price && o.price.toString().includes(val))
          );
        }
      });
      //    console.log(this.wineEventsFiltered);
    },
    selectMonth(month) {
      this.overlayPicker = !this.overlayPicker;
      this.wineEventsFiltered = _.filter(this.wineEvents, function (o) {
        if (o.date) {
          return o.date.includes(month);
        }
      });
      // console.log(this.wineEventsFiltered);
      this.isMonthFilterActive = true;
      this.isPriceFilterActive = false;
      this.isNameFilterActive = false;
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
      this.isPriceFilterActive = true;
      this.isNameFilterActive = false;
      this.isMonthFilterActive = false;
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
      this.isNameFilterActive = true;
      this.isMonthFilterActive = false;
      this.isPriceFilterActive = false;
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
.monthBtn {
  display: flex;
  justify-content: center;
  padding: 5px;
}
.resetFilters {
  background: rgb(26, 30, 39);
}
.twineIconsBox {
  width: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.active {
  border: 2px solid black !important;
}
</style>
