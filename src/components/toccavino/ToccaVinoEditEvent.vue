<template>
  <div class="formEvent">
    <div class="titleCreateEvent">
      <router-link class="btn nav-button" :to="{ name: 'toccaVinoHome' }">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h3>twine edit {{ this.$route.params.id }}</h3>
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
      id: null,
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
    this.id = this.$route.params.id;
    this.$store.commit("toggleHomePage", false);
  },
  methods: {
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

    // purtroppo non e asincrona
    uploadMedia() {
      // Create a root reference
      var storageRef = firebase.storage().ref();
      const downloadMediaUrls = [];
      for (let i = 0; i < this.mediaFiles.length; i++) {
        // File or Blob named mountains.jpg
        var file = this.mediaFiles[i];
        console.log("---");
        console.log(file);

        // Create the file metadata
        var metadata = {
          contentType: file.type,
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef
          .child("twine/" + firebase.auth().currentUser.uid + "/" + file.name)
          .put(file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log("Upload is paused");
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log("Upload is running");
                break;
            }
          },
          function (error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                console.log(error);
                break;

              case "storage/canceled":
                // User canceled the upload
                console.log(error);
                break;

              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                console.log(error);
                break;
            }
          },
          function () {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function (downloadURL) {
                console.log("File available at", downloadURL);
                downloadMediaUrls.push(downloadURL);
              });
          }
        );
      }
      this.form.media = downloadMediaUrls;
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
</style>
