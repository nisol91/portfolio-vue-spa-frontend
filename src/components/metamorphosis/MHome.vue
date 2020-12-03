<template>
  <div>meta home</div>
</template>
<script>
export default {
  created() {
    this.$store.commit("isMetamorphosis", true);
  },
};
</script>