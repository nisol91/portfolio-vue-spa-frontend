<template>
  <div id="map">
    <MglMap :accessToken="accessToken" :mapStyle="mapStyle" />
  </div>
</template>

<script>
// import VueMapbox from "vue-mapbox";
import Mapbox from "mapbox-gl";
import { MglMap } from "vue-mapbox";

export default {
  components: {
    MglMap,
  },
  data() {
    return {
      accessToken:
        "pk.eyJ1Ijoibmlzb2w5MSIsImEiOiJjazBjaWRvbTIwMWpmM2hvMDhlYWhhZGV0In0.wyRaVw6FXdw6g3wp3t9FNQ",
      mapStyle: "mapbox://styles/nisol91/ckfavr6400ebf19mrwoocgtbo",
    };
  },
  methods: {},
  computed: {},
  mounted() {
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
</style>
