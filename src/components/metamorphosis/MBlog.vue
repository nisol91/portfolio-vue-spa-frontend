<template>
  <div class="mBlogBox">blog</div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    this.$store.commit("isMetamorphosis", true);
  },
};
</script>
<style lang="scss">
.mBlogBox {
  width: 100%;
  min-height: 100vh;
}
</style>