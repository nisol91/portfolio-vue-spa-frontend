<template>
  <div class="containerFormAuth">
    <v-snackbar v-if="error" v-model="error" :timeout="3000">
      {{ error }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="error = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card formAuth">
          <div class="card-header">Register</div>
          <div class="card-body">
            <!-- <div v-if="error" class="alert alert-danger">{{ error }}</div> -->

            <v-form
              action="#"
              @submit.prevent="submit"
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                label="Name"
                :rules="nameRules"
                value
                required
                v-model="form.name"
              ></v-text-field>
              <v-text-field
                label="Email"
                :rules="emailRules"
                value
                required
                v-model="form.email"
              ></v-text-field>
              <v-text-field
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                hint="At least 8 characters"
                counter
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                label="Password"
                value
                required
                v-model="form.password"
              ></v-text-field>

              <v-btn type="submit" color="primary" rounded dark depressed>
                Register
              </v-btn>
            </v-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import firebase from "firebase";
import { db } from "../../main";

export default {
  data() {
    return {
      show1: false,
      form: {
        name: "",
        email: "",
        password: "",
      },
      error: "",
      valid: true,
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
      ],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  created() {
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
    async submit() {
      this.validate();
      if (this.validate()) {
        this.error = await this.$store.dispatch("registration", this.form);
      }
    },
  },
};
</script>
<style lang="scss">
</style>