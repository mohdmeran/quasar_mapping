<template>
        <q-dialog v-model="isShow" position="bottom">
      <q-card class="my-card">
        <q-img :src="storeInfo ? storeInfo.img_url : 'https://cdn.quasar.dev/img/chicken-salad.jpg'" />

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="fas fa-directions"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);"
            @click="getDirection"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ storeInfo ? storeInfo.store_name : 'Missing store name' }}
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            {{ `${'$'.repeat(2)}・${storeInfo ? storeInfo.type : 'Missing store type'} ` }}
          </div>
          <div class="text-caption text-grey">
            {{ storeInfo.description ? storeInfo.description : 'Description is not available' }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
<script>

export default {
  props: {
    storeInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    showDialog() {
      this.isShow = true;
    },
    getDirection() {
      if (!(this.$route.name === 'pageMap')) {
        this.$router.push({ name: 'pageMap', params: { isNavigate: true, store: JSON.stringify(this.storeInfo) } });
        return;
      }

      this.$emit('get-direction', this.storeInfo);
      this.isShow = false;
    },
  },
};
</script>
