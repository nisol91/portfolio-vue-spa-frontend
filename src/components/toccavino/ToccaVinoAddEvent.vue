<template>
  <div class="formEvent">
    <div class="titleCreateEvent">
      <router-link class="btn nav-button" :to="{ name: 'toccaVinoHome' }">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h3>twine add {{ selectedItems }}</h3>
      <div>
        <v-select
          :items="items"
          v-model="selectedItems"
          label="Select what to add"
          dense
          solo
          color="blue darken-4"
          background-color="blue darken-4"
        ></v-select>
      </div>
    </div>

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
      <v-select
        v-if="selectedItems == 'Cellars'"
        :items="cellarType"
        v-model="form.selectedCellarType"
        label="Select cellar type"
        dense
        multiple
        solo
        color="blue darken-4"
        background-color="blue darken-4"
      ></v-select>
      <v-text-field
        v-if="selectedItems !== 'Cellars'"
        label="date"
        :rules="rules"
        value
        disabled
        v-model="form.date"
      ></v-text-field>
      <v-btn
        v-if="selectedItems !== 'Cellars'"
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
        v-if="selectedItems !== 'Cellars'"
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
      <div class="uploadBox">
        <v-file-input
          v-model="mediaFiles"
          value
          label="Add fotos"
          color="blue"
          counter
          multiple
          placeholder="Select your files"
          prepend-icon="mdi-paperclip"
          outlined
          :show-size="1000"
          ><template v-slot:selection="{ index, text }">
            <v-chip v-if="index < 2" color="blue" dark label small>
              {{ text }}
            </v-chip>

            <span
              v-else-if="index === 2"
              class="overline grey--text text--darken-3 mx-2"
            >
              +{{ mediaFiles.length - 2 }} File(s)
            </span>
          </template></v-file-input
        >
        <v-btn
          class="saveEvent"
          color="primary"
          rounded
          dark
          depressed
          @click="uploadMedia"
        >
          upload
        </v-btn>
        <v-progress-circular
          v-if="uploading"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <div v-if="form.media" class="editMediaBox">
        <v-img
          v-for="(media, i) in form.media"
          :key="i + '_media'"
          :src="media"
          class="grey lighten-2 mainImgEditing"
          :aspect-ratio="16 / 9"
        >
          <v-tooltip bottom class="closeIcon">
            <template v-slot:activator="{ on, attrs }">
              <i
                v-bind="attrs"
                v-on="on"
                class="far fa-times-circle closeIcon"
                @click="removeMedia(i)"
              ></i>
            </template>
            <span>remove item</span>
          </v-tooltip>

          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </div>
      <v-btn
        v-if="form.media.length > 0 && !loading && selectedItems !== null"
        class="saveEvent"
        type="submit"
        color="primary"
        rounded
        dark
        depressed
      >
        Save
      </v-btn>
      <v-btn
        v-if="form.media.length == 0 || loading || selectedItems === null"
        class="saveEvent"
        type="submit"
        color="primary"
        rounded
        dark
        depressed
        disabled
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
import firebase from "firebase";

export default {
  mixins: [validationErrors],
  data() {
    return {
      uploading: false,
      cellarType: ["red", "white"],
      items: ["Events", "Cellars"],
      selectedItems: null,
      overlayPicker: false,
      picker: new Date().toISOString().substr(0, 10),
      loading: false,
      mediaFiles: null,
      form: {
        name: null,
        description: null,
        date: null,
        price: null,
        media: [],
        selectedCellarType: [],
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
    removeMedia(index) {
      this.form.media.splice(index, 1);
    },
    validate() {
      this.$refs.form.validate();
      return this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    // questa funzione rappresenta il caricamento asincrono di un file
    // solo rendendo il caricamento una Promise, posso aspettare che si carichi una foto e poi passare a un altra
    async uploadMedia() {
      this.uploading = true;
      const downloadMediaUrls = this.form.media;
      for (let i = 0; i < this.mediaFiles.length; i++) {
        var file = this.mediaFiles[i];
        var url = await new Promise(function (resolve, reject) {
          console.log(file);
          // Create a root reference
          var storageRef = firebase.storage().ref();
          // Create the file metadata
          var metadata = {
            contentType: file.type,
          };

          // Upload file and metadata to the object 'images/mountains.jpg'
          var uploadTask = storageRef
            .child(`twine/${firebase.auth().currentUser.uid}/${file.name}`)
            .put(file, metadata);

          var downloadUrl = uploadTask.snapshot.ref
            .getDownloadURL()
            .then(function (downloadURL) {
              console.log("File available at", downloadURL);
              return downloadURL;
            });
          resolve(downloadUrl);
        });
        downloadMediaUrls.push(url);
        console.log("---");
        console.log(downloadMediaUrls);
        console.log("---");
      }
      this.form.media = downloadMediaUrls;
      this.uploading = false;
    },
    async addEvent() {
      this.validate();
      if (this.validate()) {
        this.loading = true;
        console.log(this.form);
        if (this.selectedItems == "Events") {
          this.errors = await this.$store.dispatch("saveEvent", this.form);
        } else if (this.selectedItems == "Cellars") {
          this.errors = await this.$store.dispatch("saveCellar", this.form);
        }
        console.log(this.errors);

        this.loading = false;
        router.push({
          name: "toccaVinoHome",
          // params: { eventName: this.event.name },
        });
      }
    },
    async getPlace() {
      try {
        const coordinates = (
          await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.form.address}.json?limit=5&language=it-IT&access_token=${this.mapboxToken}`
          )
        ).data.features[0].center;
        console.log(coordinates);
        this.form.location.longitude = coordinates[0];
        this.form.location.latitude = coordinates[1];
        console.log(this.form.location);
      } catch (error) {
        console.log(error);
      }
    },
    selectDate(date) {
      this.overlayPicker = !this.overlayPicker;
      this.form.date = date;
      console.log(date);
    },

    // capitalize(value) {
    //   if (!value) return "";
    //   value = value.toString();
    //   this.form.name = value.charAt(0).toUpperCase() + value.slice(1);
    // },
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
.uploadBox {
  display: flex;
}
.titleCreateEvent {
  display: flex;
  justify-content: space-between;
}
.closeIcon {
  color: white !important;
  margin: 10px;
  cursor: pointer;
}
</style>
