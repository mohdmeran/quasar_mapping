<template>
  <q-layout view="hHh lpR fff">

    <q-page-container>
      <!-- eslint-disable-next-line vue/no-unused-vars -->
      <router-view>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  data() {
    return {
      tab: 'navigate',
    };
  },
});
</script>
