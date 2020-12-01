<template>
  <!--questo componente non e utilizzato -->
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <Index />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Index from "./Index";

export default {
  name: "App",
  components: {
    HelloWorld,
    Index,
  },
  created() {
    // console.log("aaaaa");
    // console.log(process.env.VUE_APP_TITLE);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
