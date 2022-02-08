<template>
    <q-page class="window-height window-width">
        <!-- eslint-disable-next-line max-len -->
        <div class="bg-primary text-white shadow-14 column justify-center items-center" style="height: 40vh">
            <q-avatar class="profile-shadow" size="7rem">
                <img src="https://cdn-icons-png.flaticon.com/512/147/147144.png">
            </q-avatar>
            <!-- eslint-disable-next-line max-len -->
            <div class="text-h6 text-white text-weight-medium text-capitalize q-mt-lg" style="line-height: 0.8 !important;">{{ profile.username || 'Anonymous' }}</div>
            <div class="text-caption q-mt-xs">{{ profile.email }}</div>
        </div>

        <div class="q-mt-lg shadow-14">
            <q-list bordered>
                <q-expansion-item
                    v-model="form.username.expanded"
                    expand-separator
                >
                    <template v-slot:header>
                        <q-item-section avatar>
                            <q-icon color="primary" name="perm_identity" />
                        </q-item-section>

                        <q-item-section>
                            Change Username
                        </q-item-section>
                    </template>
                    <q-card>
                        <q-card-section class="q-pa-lg">
                            <q-input :error="form.username.isError"
                            error-message="This field is required!"
                            v-model="form.username.value"
                            outlined type="username" label="username">
                                <template v-slot:prepend>
                                    <q-icon name="person" />
                                </template>
                            </q-input>
                            <div class="row justify-end q-mt-sm">
                                <q-btn @click="updateUsername"
                        unelevated color="primary" size="md" class="self-end" label="Update" />
                            </div>

                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-separator />

                <q-expansion-item
                    expand-separator
                    v-model="form.email.expanded"
                >
                    <template v-slot:header>
                        <q-item-section avatar>
                            <q-icon color="primary" name="mail" />
                        </q-item-section>

                        <q-item-section>
                            Change Email
                        </q-item-section>
                    </template>
                    <q-card>
                        <q-card-section class="q-pa-lg">
                                <q-input :error="form.email.isError"
                                error-message="This field is required!"
                                v-model="form.email.value"
                                outlined type="email" label="email">
                                    <template v-slot:prepend>
                                        <q-icon name="mail" />
                                    </template>
                                </q-input>
                                <div class="row justify-end">
                                    <q-btn @click="updateEmail"
                            unelevated color="primary" size="md" class="self-end" label="Update" />
                                </div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-separator />

                <q-expansion-item
                    expand-separator
                    v-model="form.password.expanded"
                >
                    <template v-slot:header>
                        <q-item-section avatar>
                            <q-icon color="primary" name="lock" />
                        </q-item-section>

                        <q-item-section>
                            Change password
                        </q-item-section>
                    </template>
                    <!-- PASSWORD UPDATE -->
                    <q-card>
                        <q-card-section class="q-pa-lg">
                            <q-input :error="form.password.isError"
                            :error-message="form.password.errorText"
                            v-model="form.password.value"
                            @blur="checkMatchPassword"
                            outlined type="password" label="password">
                                <template v-slot:prepend>
                                    <q-icon name="lock" />
                                </template>
                            </q-input>
                            <q-input
                            :error="form.confirm.isError"
                            :error-message="form.confirm.errorText"
                            v-model="form.confirm.value"
                            @blur="checkMatchPassword"
                            outlined type="password" label="confirm password">
                                <template v-slot:prepend>
                                    <q-icon name="lock" />
                                </template>
                            </q-input>
                            <div class="row justify-end">
                                <q-btn @click="updatePassword"
                        unelevated color="primary" size="md" class="self-end" label="Update" />
                            </div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>
            </q-list>
        </div>

        <div class="q-mt-lg q-px-xs">
            <q-btn @click="logout" unelevated color="negative" size="md"
            class="full-width" label="Log out" />
        </div>

    </q-page>
</template>

<script>
import firebase from 'src/boot/firebase';
import { useQuasar, QSpinnerFacebook } from 'quasar';

export default {
  data() {
    return {
      profile: {
        username: '',
        email: '',
      },
      form: {
        username: {
          expanded: false,
          isError: false,
          errorText: 'This field is required!',
          value: '',
        },
        email: {
          expanded: false,
          isError: false,
          errorText: 'This field is required!',
          value: '',
        },
        password: {
          expanded: false,
          isError: false,
          errorText: 'This field is required!',
          value: '',
        },
        confirm: {
          isError: false,
          errorText: 'This field is required!',
          value: '',
        },
      },
    };
  },
  created() {
    this.$q = useQuasar();
    const user = firebase.auth.currentUser;

    if (user) {
      this.profile.username = user.displayName;
      this.profile.email = user.email;
    }
  },
  methods: {
    logout() {
      this.showLoading();
      firebase.auth.signOut().then(() => {
        this.showToast('Logged out', 'info');
      }).catch((err) => {
        this.showToast(`An error occurred: ${err.message}`, 'negative');
      }).finally(() => {
        this.$q.loading.hide();
      });
    },
    checkMatchPassword() {
      const hasValue = this.form.password.value.trim() && this.form.confirm.value.trim();

      if (hasValue && !this.form.password.value.match(this.form.confirm.value)) {
        this.form.password.isError = true;
        this.form.confirm.isError = true;
        this.form.password.errorText = 'Password does not match!';
        this.form.confirm.errorText = 'Password does not match!';
        return;
      }

      this.form.password.isError = false;
      this.form.confirm.isError = false;
    },
    updateEmail() {
      if (!this.form.email.value.trim()) {
        this.form.email.isError = true;
        return;
      }

      this.showLoading();
      const user = firebase.auth.currentUser;
      user.updateEmail(this.form.email.value).then(() => {
        this.profile.email = this.form.email.value;
        this.showToast('Email updated!');
      }).catch((err) => {
        this.showToast(`An error occured: ${err.message}`, 'negative');
      }).finally(() => {
        this.$q.loading.hide();
        this.form.email.expanded = false;
      });
    },
    updateUsername() {
      if (!this.form.username.value.trim()) {
        this.form.username.isError = true;
        return;
      }

      this.showLoading();
      const user = firebase.auth.currentUser;
      user.updateProfile({ displayName: this.form.username.value }).then(() => {
        this.profile.username = this.form.username.value;
        this.showToast('Username updated!');
      }).catch((err) => {
        this.showToast(`An error occured: ${err.message}`, 'negative');
      }).finally(() => {
        this.$q.loading.hide();
        this.form.username.expanded = false;
      });
    },
    updatePassword() {
      if (!this.form.password.value.trim()) {
        this.form.password.isError = true;
        this.form.password.errorText = 'This field is required!';
      }

      if (!this.form.confirm.value.trim()) {
        this.form.confirm.isError = true;
        this.form.confirm.errorText = 'This field is required!';
      }

      if (this.form.confirm.isError || this.form.password.isError) return;

      if (!this.form.password.value.match(this.form.confirm.value)) return;

      this.showLoading();
      const user = firebase.auth.currentUser;
      user.updatePassword(this.form.password.value).then(() => {
        this.showToast('Password updated!');
      }).catch((error) => {
        this.showToast(`An error ocurred: ${error.message}`, 'negative');
      }).finally(() => {
        this.$q.loading.hide();
        this.form.password.expanded = false;
      });
    },
    showToast(message, type = 'positive') {
      this.$q.notify({
        type,
        message,
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

<style scoped>
    .profile-shadow {
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }
</style>
