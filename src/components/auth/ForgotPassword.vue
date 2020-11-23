<template>
  <div>
    <div class="card card-body">
      <form>
        <div class="" v-if="emailSent">email sent!</div>
        <div class="" v-if="error">{{ error }}</div>

        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            type="text"
            name="email"
            placeholder="Enter your e-mail"
            class="form-control"
            v-model="email"
          />
        </div>
        <v-btn @click.prevent="sendResetLink" color="blue" rounded dark
          >Send reset link</v-btn
        >
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      emailSent: false,
      error: null,
    };
  },
  methods: {
    ...mapActions({
      verifyEmail: "verifyEmail",
    }),
    async sendResetLink() {
      this.emailSent = false;
      this.error = await this.$store.dispatch("forgotPassword", this.email);
      this.emailSent = true;
    },
  },
  created() {},
};
</script>
