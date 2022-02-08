<template>
  <router-view />
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { defineComponent, onBeforeMount } from 'vue';
// eslint-disable-next-line no-unused-vars
import { useRouter, useRoute } from 'vue-router';
// eslint-disable-next-line no-unused-vars
import firebase from 'src/boot/firebase';

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter();
    const route = useRoute();

    onBeforeMount(() => {
      firebase.auth.onAuthStateChanged((user) => {
        if (!user) {
          router.replace('/login');
        } else if (route.path.includes('/login')) {
          router.replace('/');
        }
      });
    });
  },
});
</script>
