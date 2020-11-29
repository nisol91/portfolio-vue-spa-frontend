<template>
  <div>basket</div>
</template>
<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  created() {
    var basket = this.$store.state.basket;
    console.log(basket);
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