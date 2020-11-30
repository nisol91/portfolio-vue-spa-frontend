<template>
  <div class="userSettingsBox">
    <div class="userTitle">
      <router-link class="btn nav-button" :to="{ name: 'toccaVinoHome' }">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <div class="">settings</div>
    </div>

    <div class="role" v-if="user && user.role == 'superAdmin'">
      role: {{ user.role }}
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
        :items="cellarType"
        v-model="form.gender"
        label="Select gender"
        dense
        multiple
        solo
        color="blue darken-4"
        background-color="blue darken-4"
      ></v-select>
      <v-text-field
        label="birthDate"
        :rules="rules"
        value
        disabled
        v-model="form.birthDate"
      ></v-text-field>
      <v-btn
        class="saveEvent"
        color="primary"
        rounded
        dark
        depressed
        @click="overlayPicker = !overlayPicker"
      >
        Select birthDate
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
        label="age"
        :rules="rules"
        value
        required
        v-model="form.age"
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
          placeholder="Select your avatar"
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
        Save user setting
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
        Save user setting
      </v-btn>
    </v-form>
    <v-btn class="saveEvent" type="submit" color="red" rounded dark depressed>
      remove user
    </v-btn>
  </div>
</template>
<script>
import { db } from "../../main";
import firebase from "firebase";

export default {
  data() {
    return {
      env: "",
      loading: false,
      uploading: false,
      user: null,
      firebaseUser: null,
      valid: true,
      rules: [
        (v) => !!v || "field is required",
        (v) => (v && v.length >= 1) || "Name must be more than 1 characters",
      ],
      cellarType: ["male", "female"],
      selectedItems: null,
      overlayPicker: false,
      picker: new Date().toISOString().substr(0, 10),
      mediaFiles: null,
      form: {
        name: null,
        description: null,
        birthDate: null,
        age: null,
        media: [],
        gender: [],
        address: null,
        location: {
          latitude: 0,
          longitude: 0,
        },
      },
    };
  },
  mounted() {
    this.$store.commit("toggleHomePage", false);

    this.getUser(firebase.auth().currentUser.uid);
  },
  methods: {
    getUser(id) {
      this.loading = true;
      this.firebaseUser = firebase.auth().currentUser;

      db.collection(`users${this.env}`)
        .doc(id)
        .get()
        .then((querySnapshot) => {
          // console.log(querySnapshot);
          const user = querySnapshot.data();

          console.log(user);
          this.user = user;
          this.loading = false;
        })
        .catch((error) => {
          this.errors = error.response && error.response.data.errors;
        });
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
  },
};
</script>
<style lang="scss">
.userTitle {
  display: flex;
  align-items: center;
}
.userSettingsBox {
  padding: 20px;
  min-height: 100vh;
}
.role {
  border: 1px solid rgb(54, 54, 54);
  width: 150px;
  text-align: center;
}
</style>