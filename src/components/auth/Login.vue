<template>
  <div class="containerFormAuth">
    <v-snackbar v-if="error" v-model="error" :timeout="30000">
      {{ error }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="error = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <div class="formAuth row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Login</div>
          <div class="card-body">
            <!-- <div v-if="error" class="alert alert-danger">{{ error }}</div> -->

            <form action="#" @submit.prevent="submit">
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
                    Login
                  </v-btn>
                </div>
              </div>
            </form>
            <div class="form-group row mb-0">
              <div class="col-md-8 offset-md-4">
                <v-btn
                  type="submit"
                  color="grey"
                  rounded
                  dark
                  depressed
                  @click="googleSignin"
                >
                  Signin with google
                  <v-icon class="actionIcon">mdi-google</v-icon>
                </v-btn>
              </div>
            </div>

            <div class="form-group row mb-0">
              <div class="col-md-8 offset-md-4">
                <router-link :to="{ name: 'forgotPassword' }"
                  ><v-btn color="blue" rounded dark>forgot password?</v-btn>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      error: null,
    };
  },
  created() {
    this.$store.commit("toggleHomePage", false);
  },
  methods: {
    async submit() {
      this.error = await this.$store.dispatch("login", this.form);
    },
    async googleSignin() {
      this.error = await this.$store.dispatch("googleLogin");
    },
  },
};
</script>
<style lang="scss">
.google {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>