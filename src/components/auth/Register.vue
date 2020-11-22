<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Register</div>
          <div class="card-body">
            <!-- <div v-if="error" class="alert alert-danger">{{ error }}</div> -->
            <v-snackbar v-if="error" v-model="error">
              {{ error }}

              <template v-slot:action="{ attrs }">
                <v-btn color="red" text v-bind="attrs" @click="error = false">
                  Close
                </v-btn>
              </template>
            </v-snackbar>
            <form action="#" @submit.prevent="submit">
              <div class="form-group row">
                <label for="name" class="col-md-4 col-form-label text-md-right"
                  >Name</label
                >

                <div class="col-md-6">
                  <input
                    id="name"
                    type="name"
                    class="form-control"
                    name="name"
                    value
                    required
                    autofocus
                    v-model="form.name"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right"
                  >Email</label
                >

                <div class="col-md-6">
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    name="email"
                    value
                    required
                    autofocus
                    v-model="form.email"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label
                  for="password"
                  class="col-md-4 col-form-label text-md-right"
                  >Password</label
                >

                <div class="col-md-6">
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    name="password"
                    required
                    v-model="form.password"
                  />
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <v-btn type="submit" color="primary" rounded dark depressed>
                    Register
                  </v-btn>
                </div>
              </div>
            </form>
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
      form: {
        name: "",
        email: "",
        password: "",
      },
      error: "",
    };
  },
  created() {
    this.$store.commit("toggleHomePage", false);
  },
  methods: {
    async submit() {
      this.error = await this.$store.dispatch("registration", this.form);
    },
  },
};
</script>