<template>
  <div class="formEvent">
    <div class="text-white">toccavino add event</div>

    <v-form
      action="#"
      @submit.prevent="addEvent"
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        label="name"
        :rules="rules"
        value
        required
        v-model="form.name"
      ></v-text-field>
      <v-text-field
        label="description"
        :rules="rules"
        value
        required
        v-model="form.description"
      ></v-text-field>
      <v-text-field
        label="date"
        :rules="rules"
        value
        disabled
        v-model="form.date"
      ></v-text-field>
      <v-btn
        class="saveEvent"
        color="primary"
        rounded
        dark
        depressed
        @click="overlayPicker = !overlayPicker"
      >
        Select date
      </v-btn>
      <v-overlay :value="overlayPicker"
        ><div @click="overlayPicker = !overlayPicker">
          <i class="fas fa-times closeMonthPicker"></i>
        </div>
        <v-date-picker v-model="picker"></v-date-picker>

        <div class="monthBtn">
          <v-btn
            type="submit"
            color="primary"
            rounded
            dark
            depressed
            @click="selectDate(picker)"
          >
            SELECT
          </v-btn>
        </div>
      </v-overlay>
      <v-text-field
        label="price"
        :rules="rules"
        value
        required
        v-model="form.price"
      ></v-text-field>
      <v-text-field
        label="city"
        :rules="rules"
        value
        required
        v-model="form.city"
      ></v-text-field>
      <v-text-field
        label="full address"
        :rules="rules"
        value
        required
        v-model="form.address"
        @keyup="getPlace()"
      ></v-text-field>

      <v-btn
        class="saveEvent"
        type="submit"
        color="primary"
        rounded
        dark
        depressed
      >
        Save
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import validationErrors from "../shared/mixins/validationErrors";
import router from "../../routes";
import axios from "axios";
import moment from "moment";

export default {
  mixins: [validationErrors],
  data() {
    return {
      overlayPicker: false,
      picker: new Date().toISOString().substr(0, 10),
      loading: false,
      form: {
        name: null,
        description: null,
        date: null,
        price: null,
        media: [],
        city: null,
        address: null,
        location: {
          latitude: 0,
          longitude: 0,
        },
      },
      valid: true,
      rules: [
        (v) => !!v || "field is required",
        (v) => (v && v.length >= 1) || "Name must be more than 1 characters",
      ],
      mapboxToken:
        "pk.eyJ1Ijoibmlzb2w5MSIsImEiOiJjazBjaWRvbTIwMWpmM2hvMDhlYWhhZGV0In0.wyRaVw6FXdw6g3wp3t9FNQ",
    };
  },

  created() {
    this.$store.commit("toggleHomePage", false);
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async addEvent() {
      this.loading = true;
      // this.capitalize(this.form.name);
      this.validate();
      console.log(this.form);
      this.errors = await this.$store.dispatch("saveEvent", this.form);
      console.log(this.errors);

      this.loading = false;
      router.push({
        name: "toccaVinoHome",
        // params: { eventName: this.event.name },
      });
    },
    async getPlace() {
      try {
        const coordinates = (
          await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.form.address}.json?limit=5&language=it-IT&access_token=${this.mapboxToken}`
          )
        ).data.features[0].center;
        console.log(coordinates);
        this.form.location.latitude = coordinates[0];
        this.form.location.longitude = coordinates[1];
      } catch (error) {
        console.log(error);
      }
    },
    selectDate(date) {
      this.overlayPicker = !this.overlayPicker;
      this.form.date = date;
      console.log(date);
    },

    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      this.form.name = value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  filters: {},
  computed: {
    // ...mapGetters({ itemsInBasket: "itemsInBasket" }),
    // se voglio prendere direttamente basket.items faccio cosi
    // ...mapState({ basket: state => state.basket.items })
    // cosi mi prende solo l'oggetto padre
    // ...mapState({ basket: "basket" }),
  },
};
</script>

<style lang="scss">
.formEvent {
  display: flex;
  flex-direction: column;
  padding: 30px;
}
.saveEvent {
  margin: 20px 0;
}
</style>
