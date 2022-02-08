<template>
    <div>
      <div class="row" style="z-index:1000">
        <h2 class="text-h2 text-primary text-weight-bold q-my-sm">Sign In</h2>
      </div>
      <div class="row">
        <q-card bordered class="q-pa-lg shadow-3">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input v-model="email" type="email" label="email">
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>
              <q-input v-model="password" type="password" label="password">
              <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
            <div class="q-mt-md">
              <div v-if="form.error"
              class="text-caption text-red">{{ form.errorText }}</div>
            </div>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn @click="login"
            unelevated color="primary" size="lg" class="full-width" label="Login" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6 q-pt-md">
                Not registered?
                <a
                href="#/login/register" class="text-primary text-weight-bold">Create an Account</a>
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
</template>

<script>
import firebase from 'src/boot/firebase';
import { useQuasar, QSpinnerFacebook } from 'quasar';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      form: {
        errorText: '',
        error: false,
      },
      $q: Object,
    };
  },
  created() {
    this.$q = useQuasar();
  },
  methods: {
    login() {
      if (!this.email.trim() || !this.password.trim()) {
        this.form.errorText = 'Please fill all field!';
        this.form.error = true;
        return;
      }

      this.form.error = false;
      this.showLoading();
      firebase.auth.signInWithEmailAndPassword(this.email, this.password).then((userCredential) => {
        // Signed in
        // eslint-disable-next-line no-console
        console.log(userCredential);
      })
        .catch((error) => {
          this.form.errorText = error.message;
          this.form.error = true;
        }).finally(() => {
          this.$q.loading.hide();
        });
    },
    showLoading() {
      this.$q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'blue',
        spinnerSize: 140,
        backgroundColor: 'gray',
        message: 'Login In...',
        messageColor: 'blue',
      });
    },
  },
};
</script>
