<template>
    <div>
      <div class="row" style="z-index:1000">
        <h2 class="text-h2 text-primary text-weight-bold q-my-sm">Register</h2>
      </div>
      <div class="row">
        <q-card bordered class="q-pa-lg shadow-3">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input v-model="username" type="username" label="username">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
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
              <q-input
                v-model="confirmPassword"
                type="password"
                label="confirm password"
                @blur="checkMatchPassword">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
            <div class="q-mt-md">
              <div v-if="form.unmatchedError"
              class="text-caption text-red">Unmatched password, please check again!</div>
              <div v-if="form.fillError"
              class="text-caption text-red">Please fill in all field!</div>
              <div v-if="form.registerError"
              class="text-caption text-red"> {{ form.registerErrorText }}</div>
            </div>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
            @click="register"
            unelevated color="primary" size="lg" class="full-width" label="Register" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6 q-pt-md">
                Already have an account?
                <a href="#/login/" class="text-primary text-weight-bold">Sign In</a>
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
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      form: {
        fillError: false,
        unmatchedError: false,
        registerError: false,
        registerErrorText: '',
      },
      $q: Object,
    };
  },
  created() {
    this.$q = useQuasar();
  },
  methods: {
    checkMatchPassword() {
      const hasValue = this.password.trim() && this.confirmPassword.trim();

      if (!this.password.match(this.confirmPassword) && hasValue) {
        this.form.unmatchedError = true;
      }
    },
    register() {
      // eslint-disable-next-line max-len
      if (!this.username.trim() || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
        this.form.fillError = true;
        return;
      }

      this.form.fillError = false;

      if (!this.password.match(this.confirmPassword)) {
        return;
      }

      this.showLoading();

      firebase.auth.createUserWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          userCredential.user.updateProfile({
            displayName: '',
          });
          // eslint-disable-next-line no-console
          console.log('register!');
        })
        .catch((error) => {
          this.form.registerError = true;
          this.form.registerErrorText = error.message;
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
    showLoading() {
      this.$q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'blue',
        spinnerSize: 140,
        backgroundColor: 'gray',
        message: 'Registering...',
        messageColor: 'blue',
      });
    },
  },
};
</script>
