<template>
  <div id="map">
    <!-- <MglMap :accessToken="accessToken" :mapStyle="mapStyle" /> -->
    <MglMap
      :accessToken="accessToken"
      :mapStyle.sync="mapStyle"
      :center="coordinates"
      :zoom="7"
    >
      <MglMarker
        v-for="event in wineEvents"
        :key="event.name"
        :coordinates="[event.location.latitude, event.location.longitude]"
        color="blue"
        ><i
          v-if="!event.isCellar"
          slot="marker"
          class="fas fa-wine-glass-alt markerWine"
        ></i>
        <i
          v-if="event.isCellar"
          slot="marker"
          class="fas fa-wine-bottle markerWine"
        ></i>
      </MglMarker>
    </MglMap>
  </div>
</template>

<script>
// import VueMapbox from "vue-mapbox";
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker } from "vue-mapbox";

export default {
  components: {
    MglMap,
    MglMarker,
  },
  props: ["events"],
  data() {
    return {
      accessToken:
        "pk.eyJ1Ijoibmlzb2w5MSIsImEiOiJjazBjaWRvbTIwMWpmM2hvMDhlYWhhZGV0In0.wyRaVw6FXdw6g3wp3t9FNQ",
      mapStyle: "mapbox://styles/nisol91/ckfavr6400ebf19mrwoocgtbo",
      coordinates: [10, 45],
    };
  },
  methods: {},
  computed: {
    wineEvents: {
      get() {
        //   nel metodo computed get() posso anche bindare la props a un data in questo modo
        // this.err = this.errorsForm;
        // cosi posso sempre accedere col nome della computed prop (formErrors in questo caso)
        return this.events;
      },
      set() {},
    },
  },
  mounted() {
    console.log(this.events);

    // mapboxgl.accessToken = this.token;
    // const map = new mapboxgl.Map({
    //   accessToken: this.token,
    //   container: "map", // container id
    //   style: "mapbox://styles/nisol91/ckfavr6400ebf19mrwoocgtbo", // style URL
    //   center: [11, 45], // starting position [lng, lat]
    //   zoom: 5, // starting zoom
    // });
    // const geocoder = new MapboxGeocoder({
    //   accessToken: this.token,
    //   mapboxgl: mapboxgl,
    // });
    // map.addControl(geocoder);
    // console.log(geocoder);
  },
};
</script>

<style scoped>
#map {
  height: 300px;
  width: 100%;
}
.markerWine {
  font-size: 20px;
  color: rgb(104, 41, 46);
}
</style>
