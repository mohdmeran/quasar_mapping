<template>
    <!-- eslint-disable-next-line max-len -->
    <q-card class="my-card shadow-4 q-ma-md" style="width: 100%; border-radius: 30px; bottom: 80px;" flat bordered>
        <q-card-section horizontal>
            <q-card-section flex flex-center>
              <q-img
                  class="col"
                  style="width: 100px"
                  :src="store.img_url"
              />
            </q-card-section>

            <q-card-section class="column justify-center">
            <div class="text-h6 q-mt-sm q-mb-xs">{{ store.store_name || 'Missing Name' }}</div>
            <div class="text-caption text-grey">
                <!-- eslint-disable-next-line max-len -->
                {{ store.lot }}
            </div>
            </q-card-section>
            <q-card-actions class="column justify-center col-grow">
                <!-- eslint-disable-next-line max-len -->
                <q-btn push color="negative" :label="btn_label" style="width:100%" @click="triggerExit" />
            </q-card-actions>
        </q-card-section>
    </q-card>
</template>
<script>

export default {
  props: {
    store: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      btn_label: 'Exit',
      showDialog: false,
    };
  },
  methods: {
    toggleDialog() {
      this.showDialog = !this.showDialog;
    },
    triggerExit() {
      this.$emit('exit');
    },
  },
};
</script>
