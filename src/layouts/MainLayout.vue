<template>
  <q-layout view="hHh lpR fff">

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-white text-white">
      <div class="q-gutter-y-md">
        <q-tabs
          switch-indicator
          aligh="justify"
          v-model="tab"
          class="bg-primary"
        >
          <q-route-tab to="/offers" exact name="discover" icon="fas fa-glasses" label="Discover" />
          <q-route-tab to="/map" exact name="navigate" icon="fas fa-route" label="Navigate" />
          <q-route-tab to="/mapper" exact name="profile" icon="fas fa-user" label="Profile" />
        </q-tabs>
      </div>
    </q-footer>
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
