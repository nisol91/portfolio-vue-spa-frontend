import Vue from 'vue'
import App from './App.vue'
// import Index from './Index.vue'
import router from "./routes";
import VueRouter from "vue-router";
import moment from "moment";
import Vuex from 'vuex'
import storeDefinition from './store'
import VueMapbox from "vue-mapbox";
import Mapbox from "mapbox-gl";
import vuetify from './vuetify'
import inViewportDirective from "vue-in-viewport-directive";
import { messages } from "./i18n/translations"
import VueI18n from 'vue-i18n'
import VueMeta from 'vue-meta'
import firebase from "firebase";



//----

// import StarRating from './shared/components/StarRating'
// import FatalError from './shared/components/FatalError'
// import ValidationErrors from './shared/components/ValidationErrors'
// import Success from './shared/components/Success'
// import SuccessBanner from './shared/components/SuccessBanner'
// import NotFound from './shared/components/NotFound'
// import ButtonCheck from './shared/components/ButtonCheck'
// import MapboxMap from './shared/components/MapboxMap'
// import MapboxSearch from './shared/components/MapboxSearch'
// import UserSettings from "../js/user/UserSettings"
// import ModalForm from "../js/shared/components/ModalForm.vue"
// import DeleteForm from "../js/shared/components/DeleteForm.vue"
// import CustomSelect from "../js/shared/components/CustomSelect.vue"
// import ModalConfirmDelete from "../js/shared/components/ModalConfirmDelete.vue"
// import FileLoader from "../js/shared/components/FileLoader.vue"
// import SelectLocale from './locales/SelectLocale.vue'


Vue.config.productionTip = false



Vue.use(VueRouter);
Vue.use(Vuex)
Vue.use(VueMapbox, { mapboxgl: Mapbox });
Vue.use(VueI18n)

Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
})


Vue.directive("in-viewport", inViewportDirective);

// define filters globally
Vue.filter('fromNow', value => moment(value).fromNow())

// register components that i want to be registered globally, such as shared components
// Vue.component('star-rating', StarRating);
// Vue.component('fatal-error', FatalError);
// Vue.component('v-errors', ValidationErrors);
// Vue.component('success', Success);
// Vue.component('success-banner', SuccessBanner);
// Vue.component('not-found', NotFound);
// Vue.component('button-check', ButtonCheck);
// Vue.component('mapbox-map', MapboxMap);
// Vue.component('mapbox-search', MapboxSearch);
// Vue.component('user-settings', UserSettings);
// Vue.component('modal-form', ModalForm);
// Vue.component('delete-form', DeleteForm);
// Vue.component('custom-select', CustomSelect);
// Vue.component('modal-confirm-delete', ModalConfirmDelete);
// Vue.component('file-loader', FileLoader);
// Vue.component('select-locale', SelectLocale);


// vuex
const store = new Vuex.Store(storeDefinition)

const i18n = new VueI18n({
  locale: 'en',
  messages
});

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW3XY0Dg3E27kaIFM4IfvITbl5pXyw3io",
  authDomain: "portfolio-f8a45.firebaseapp.com",
  databaseURL: "https://portfolio-f8a45.firebaseio.com",
  projectId: "portfolio-f8a45",
  storageBucket: "portfolio-f8a45.appspot.com",
  messagingSenderId: "267374463312",
  appId: "1:267374463312:web:6a059df7346a2e33fb0455",
  measurementId: "G-6592GFSW3F"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);


new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
  async beforeCreate() {
    console.log('before');
    // load data stored in session if there are some
    // this.$store.dispatch('loadStoredState')
    // this.$store.dispatch('loadUser')

  },
}).$mount('#app')

