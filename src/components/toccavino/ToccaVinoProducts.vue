<template>
  <div class="ecommerceBox">
    <div class="eHeader">
      <div class="eTitle">wine ecommerce</div>
    </div>
    <div class="eFiltersTop">filtri top</div>
    <div class="eBody">
      <div class="eFiltersLateral">filtri lateral</div>

      <div class="eProducts">
        <div
          class="eProduct"
          v-for="(product, i) in products"
          :key="i + '_prod'"
        >
          {{ product }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      products: ["a", "b", "c"],
    };
  },
};
</script>
<style lang="scss">
.ecommerceBox {
  width: 100%;
  min-height: 100vh;
}
.eFiltersLateral {
  width: 20%;
  background: rgb(115, 120, 126);
}
.eFiltersTop {
  width: 100%;
  background: rgb(154, 166, 180);
}
.eHeader {
  width: 100%;
  background: rgb(177, 177, 177);
}
.eProducts {
  width: 80%;
  background: rgb(76, 80, 85);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.eProduct {
  width: 20%;
  height: 200px;
  border-radius: 3px;
  background: rgb(201, 212, 226);
  margin: 10px;
  padding: 10px;
}
.eBody {
  display: flex;
  min-height: 100%;
}
</style>