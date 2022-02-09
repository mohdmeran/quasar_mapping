<template>
    <div>
        <q-card class="my-card shadow-10">
            <q-card-section class="q-pa-md" horizontal>
                <q-img :src="store.img_url"  style="height: 80px; width: 80px"/>
                <q-card-section>
                    <div class="text-h5 text-weight-bold"> {{ store.store_name }} </div>
                    <div class="text-h6 text-weight-regular">{{ promoText }}</div>
                </q-card-section>

                <q-card-section class="column justify-center">
                    <q-btn color="primary" label="Visit" @click="showDialog" />
                </q-card-section>
            </q-card-section>
        </q-card>

        <store-dialog :storeInfo="store" ref="dialog" />
    </div>
</template>
<script>
import StoreDialog from './StoreDialog.vue';

export default {
  props: {
    store: Object,
    promoText: String,
  },
  components: {
    StoreDialog,
  },
  created() {
    // eslint-disable-next-line no-console
    console.log(this.logo);
  },
  data() {
    return {
      stars: 5,
      error: '',
      src: '',
      dialog: {
        show: false,
      },
    };
  },
  methods: {
    showDialog() {
      this.$refs.dialog.showDialog();
    },
  },
};
</script>
