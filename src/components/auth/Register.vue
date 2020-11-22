<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Register</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
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
                <v-btn @click="submit" color="primary" rounded dark depressed>
                  Register
                </v-btn>
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
import { db } from "../../main";

export default {
  data() {
    return {
      form: {
        name: "",
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
    submit() {
      this.$store.dispatch("registration");
      // firebase
      //   .auth()
      //   .createUserWithEmailAndPassword(this.form.email, this.form.password)
      //   .then((data) => {
      //     db.collection("users")
      //       .doc(data.user.uid)
      //       .set({ name: this.form.name });
      //   })
      //   .then(() => {
      //     // now we have access to the signed in user
      //     const user = firebase.auth().currentUser;
      //     // send the signed in user a verification email
      //     const actionCodeSettings = {
      //       url: `https://${window.location.hostname}/auth/login`,
      //     };
      //     user.sendEmailVerification(actionCodeSettings);
      //   })
      //   .catch((err) => {
      //     this.error = err.message;
      //   });
    },
  },
};
</script>