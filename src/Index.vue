<template>
  <!-- nell index è comodo mettere la navigazione dell'app -->
  <div>
    <v-app>
      <div
        class="my-navbar d-flex justify-content-between align-items-center"
        :class="[{ 'my-navbar-hidden': getOffsetNav }]"
      >
        <div>
          <!-- <router-link class="navbar-brand mr-auto" v-bind:to="{ name: 'home' }"
            >Logo nsz</router-link
          > -->
          <div
            class="nav-children"
            v-if="this.$store.state.isHomePage"
            @click="
              $vuetify.goTo('#home', options);
              selectedEl = '';
            "
          >
            <img
              class="logoImg"
              :src="'https://firebasestorage.googleapis.com/v0/b/portfolio-f8a45.appspot.com/o/logo_nsz.png?alt=media&token=af711a53-d6d5-46ce-85a0-06ace2c7e62d'"
            />
          </div>
          <div v-if="!this.$store.state.isHomePage" class="nav-children">
            <router-link :to="{ name: 'home' }"
              ><img
                class="logoImg"
                :src="'https://firebasestorage.googleapis.com/v0/b/portfolio-f8a45.appspot.com/o/logo_nsz.png?alt=media&token=af711a53-d6d5-46ce-85a0-06ace2c7e62d'"
            /></router-link>
          </div>
        </div>
        <!-- hamburger menu -->
        <div
          v-if="this.$store.state.isHomePage"
          class="nav-dx-menu d-flex justify-content-end"
          @click="toggleMenuMobile"
        >
          <i class="fas fa-bars"></i>
        </div>
        <!--  -->
        <div
          v-if="!this.$store.state.isHomePage"
          class="nav-children"
          id="backToHome"
        >
          <router-link :to="{ name: 'home' }">back to home</router-link>
        </div>
        <div
          class="d-flex justify-content-between align-items-center dxBoxNavbar"
          v-if="this.$store.state.isHomePage"
        >
          <div
            class="nav-children nav-children-dx"
            @click="
              $vuetify.goTo('#projects', options);
              selectedEl = 'projects';
            "
            :class="[{ active: selectedEl == 'projects' }]"
          >
            Projects
          </div>
          <div
            class="nav-children nav-children-dx"
            @click="
              $vuetify.goTo('#about', options);
              selectedEl = 'about';
            "
            :class="[{ active: selectedEl == 'about' }]"
          >
            About
          </div>
          <div
            class="nav-children nav-children-dx"
            @click="
              $vuetify.goTo('#skills', options);
              selectedEl = 'skills';
            "
            :class="[{ active: selectedEl == 'skills' }]"
          >
            Skills
          </div>
          <div
            class="nav-children nav-children-dx"
            @click="
              $vuetify.goTo('#contact', options);
              selectedEl = 'contact';
            "
            :class="[{ active: selectedEl == 'contact' }]"
          >
            Contact
          </div>

          <!-- mobile menu -->
          <div
            class="d-flex justify-content-between align-items-center flex-column mobile-menu"
            :class="[{ 'mobile-menu-show': menuOpen == true }]"
          >
            <div
              class="nav-children nav-children-mobile"
              @click="
                $vuetify.goTo('#projects', options);
                selectedEl = 'projects';
                toggleMenuMobile();
              "
              :class="[{ active: selectedEl == 'projects' }]"
            >
              Projects
            </div>
            <div
              class="nav-children nav-children-mobile"
              @click="
                $vuetify.goTo('#about', options);
                selectedEl = 'about';
                toggleMenuMobile();
              "
              :class="[{ active: selectedEl == 'about' }]"
            >
              About
            </div>
            <div
              class="nav-children nav-children-mobile"
              @click="
                $vuetify.goTo('#skills', options);
                selectedEl = 'skills';
                toggleMenuMobile();
              "
              :class="[{ active: selectedEl == 'skills' }]"
            >
              Skills
            </div>
            <div
              class="nav-children nav-children-mobile"
              @click="
                $vuetify.goTo('#contact', options);
                selectedEl = 'contact';
                toggleMenuMobile();
              "
              :class="[{ active: selectedEl == 'contact' }]"
            >
              Contact
            </div>
          </div>
          <!--  -->

          <!-- <router-link
            class="nav-children btn nav-button"
            :to="{ name: 'toccaVinoHome' }"
            >toccaVinoHome</router-link
          >
          <router-link
            class="nav-children btn nav-button"
            :to="{ name: 'laravelBnB' }"
            >LaravelBnB</router-link
          > -->

          <!-- <router-link class="btn nav-button" :to="{ name: 'basket' }">
            Basket
            <span v-if="itemsInBasket" class="badge badge-secondary">{{
              itemsInBasket
            }}</span>
          </router-link>
          
          <router-link
            v-if="isUserAdmin"
            class="btn nav-button"
            :to="{ name: 'adminDashboard' }"
            >AdminDashboard</router-link
          > -->
          <router-link
            v-if="!isLoggedIn"
            class="btn nav-button"
            :to="{ name: 'login' }"
            >login</router-link
          >
          <v-chip class="ma-2" v-if="isLoggedIn">
            Hey, {{ this.$store.state.user.displayName }}
          </v-chip>
          <router-link
            v-if="!isLoggedIn"
            class="btn nav-button"
            :to="{ name: 'register' }"
            >register</router-link
          >
          <router-link
            class="userIndexIcon"
            v-if="isLoggedIn"
            :to="{ name: 'userProfile' }"
            ><v-icon class="userIndexIcon"
              >mdi-account-circle</v-icon
            ></router-link
          >
          <div v-if="isLoggedIn" class="btn nav-button" @click.prevent="logout">
            logout
          </div>
        </div>
      </div>
      <div class="mainBox" v-scroll="onScroll">
        <!--  -->
        <router-view v-if="loaded"></router-view>
        <!--  -->
        <global-message
          v-if="globalMessage"
          :globalMex="globalMessage"
          :error="false"
        ></global-message>

        <!--  -->
        <div v-if="!loaded" class="splash-box">
          <v-progress-circular
            :size="70"
            color="primary"
            indeterminate
            class="splash-box-progress"
          ></v-progress-circular>
        </div>
        <div
          id="footer"
          class="d-flex justify-content-center align-items-center flex-column"
        >
          <select-locale class="langVSelect"></select-locale>
          <select-locale class="langVSelectMobile"></select-locale>

          <div
            class="icons-box d-flex justify-content-between align-items-center mb-2"
          >
            <a href="https://github.com/nisol91?tab=repositories"
              ><i class="fab fa-github"></i
            ></a>
            <a href="https://www.instagram.com/0nic1/?hl=it"
              ><i class="fab fa-instagram"></i
            ></a>
            <a href="https://www.linkedin.com/in/nicola-solzi-07767614a/"
              ><i class="fab fa-linkedin-in"></i
            ></a>
          </div>
          <div class="footer">
            App made with Firebase
            <img
              class="footerFirebaseImg"
              src="https://firebasestorage.googleapis.com/v0/b/portfolio-f8a45.appspot.com/o/firebase-icon.png?alt=media&token=d4a6745f-e655-46c7-8e38-3c0c3724d193"
              alt=""
            />
            and VueJs
            <i class="fab fa-vuejs"></i>
          </div>
        </div>
      </div>
    </v-app>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import * as easings from "vuetify/es5/services/goto/easing-patterns";
import axios from "axios";
import firebase from "firebase";
import store from "./store";

export default {
  // this can be used alternatively to the meta in the head of welcome.blade.php page, for seo purpose
  metaInfo: {
    title: "NsZ Developer Portfolio Site",
    titleTemplate: "%s - Web and Mobile developer!",
    htmlAttrs: {
      lang: "en",
      amp: true,
    },
  },
  data() {
    return {
      // lastSearch: this.$store.state.lastSearch,
      menuOpen: false,
      loaded: false,
      offsetTop: 0,
      selectedEl: "",
      scrollOptions: {
        duration: 800,
        offset: 90,
        easing: "easeInOutCubic",
      },
    };
  },
  async created() {
    this.loaded = false;
    // console.log(process.env.VUE_APP_TITLE);
    console.log(process.env.NODE_ENV);
    console.log(process.env.VUE_APP_DB_ENV);

    // carico l utente firebase dopo il refresh
    this.$store.dispatch("loadFirebaseUserAfterRefresh");
    this.$store.commit("getUserOnRefresh");

    // carico il carrello al refresh
    this.$store.dispatch("loadBasketOnRefresh");

    // console.log("====");
    // console.log(this.lastSearch);
    // console.log(this.lastSearchComputed);
    // console.log(this.itemsInBasket);

    // console.log("ruolo index " + this.userRole);
    setTimeout(() => {
      this.loaded = true;
    }, 1000);
  },
  computed: {
    ...mapState({
      isLoggedIn: "isLoggedIn",
      userRole: "userRole",
      globalMessage: "globalMessage",
    }),

    ...mapGetters({ itemsInBasket: "itemsInBasket" }),

    // globalMessage: {
    //   get() {
    //     return this.globalMessage;
    //   },
    //   set(globalMessage) {
    //     this.globalMessage = globalMessage;
    //   },
    // },

    isUserAdmin() {
      if (this.userRole === "developer" || this.userRole === "admin") {
        return true;
      } else {
        return false;
      }
    },
    // scroll
    options() {
      return {
        duration: this.scrollOptions.duration,
        offset: this.scrollOptions.offset,
        easing: this.scrollOptions.easing,
      };
    },

    getOffsetNav() {
      if (this.offsetTop > 80) {
        return true;
      }
      return false;
    },
  },

  methods: {
    onClickOutside() {
      if (this.menuOpen == true) {
        this.menuOpen = false;
      }
    },
    toggleMenuMobile() {
      this.menuOpen = !this.menuOpen;
      // console.log(this.menuOpen);
    },
    onScroll(e) {
      this.offsetTop = e.target.scrollingElement.scrollTop;
      //   console.log("====================================");
      //   console.log(e.target.scrollingElement.scrollTop);
      //   console.log("====================================");
    },
    async logout() {
      this.$store.dispatch("signOut");
    },
  },
};
</script>
<style lang="scss">
#footer {
  width: 100%;
  border-bottom: 1px solid grey;
  padding: 20px 40px;
  background: rgb(107, 109, 114);
}
.footerFirebaseImg {
  width: 30px;
}
.loginName {
  width: 100px;
  margin: 0 10px;
}
.userIndexIcon {
  &:hover {
    text-decoration: none !important;
    border: 2px !important;
    color: rgb(85, 89, 109) !important;
  }
}
.indexSnack {
  margin-top: 100px !important;
}
</style>
