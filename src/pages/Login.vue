<template>
  <q-page class="window-height window-width row justify-center items-end">
    <div class="absolute-center" >
        <svg id="visual" viewBox="0 0 900 600" width="900" height="600" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
            <g transform="translate(472.95797091385776 307.1751195295715)">
                <path id="blob1"
                    d="M139.7 -147C170 -109.4 176 -54.7 184
                    8C192 70.7 202.1 141.4 171.8 170.9C141.4 200.4 70.7 188.7 17.7
                    171C-35.4 153.4 -70.7 129.7 -119.4 100.2C-168 70.7
                    -230 35.4 -237.4 -7.4C-244.9 -50.2 -197.7 -100.4
                    -149.1 -138.1C-100.4 -175.7 -50.2 -200.9 2.2
                    -203.1C54.7 -205.3 109.4 -184.7 139.7 -147"
                    fill="#1976D2"></path>
            </g>

            <g transform="translate(418.0560087836375 285.7564980823581)" class="hidden">
                <path id="blob2"
                    d="M189.1 -166.4C236.8 -141.4 261.4 -70.7 255.6 -5.8C249.8
                        59.2 213.7 118.3 166 157.2C118.3 196 59.2 214.5 10.6 203.9C-37.9
                        193.3 -75.9 153.6 -111.9 114.7C-147.9 75.9 -181.9 37.9 -190.4
                        -8.5C-198.9 -54.9 -181.8 -109.8 -145.8 -134.8C-109.8 -159.8 -54.9
                        -154.9 7.9 -162.8C70.7 -170.7 141.4 -191.4 189.1 -166.4"
                    fill="#1976D2"></path>
            </g>
        </svg>
    </div>
    <div class="column">
      <div class="row" style="z-index:1000">
        <h2 class="text-h2 text-primary text-weight-bold q-my-sm">Sign In</h2>
      </div>
      <div class="row">
        <q-card bordered class="q-pa-lg shadow-3">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input clearable v-model="email" type="email" label="email" />
              <q-input clearable v-model="password" type="password" label="password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated color="primary" size="lg" class="full-width" label="Login" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6 q-pt-md">
                Not registered?
                <span class="text-primary text-weight-bold">Create an Account</span>
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="column" style="z-index:1000">
        <h2 class="text-h2 text-primary text-weight-thin q-my-md">LOKETLA</h2>
    </div>
  </q-page>
</template>

<script>
/* eslint-disable */
import KUTE from 'kute.js';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  mounted() {
      const tween = KUTE.fromTo(
  '#blob1',
  { path: '#blob1' },
  { path: '#blob2' },
  { repeat: 999, duration: 10000, yoyo: true },
);
    tween.start();
  },
};
</script>
