<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      persistent
      v-model="isShow"
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
          <q-card-section class="row justify-between w-100">
          <q-input class="col-10 w-100" placeholder="Search stores..."
          rounded outlined v-model="searchText" :dense="true">
            <template v-slot:prepend>
              <q-icon color="primary" left name="fas fa-search" />
            </template>
          </q-input>
          <q-btn class="" flat round icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div v-if="category"
          class="text-h5 text-bold text-black q-mt-sm q-mb-xs">{{ category }}</div>
          <!-- eslint-disable-next-line max-len -->
          <q-scroll-area :delay="0" :visible="false" style="height: 88vh; max-width: 100vh;">
            <!-- eslint-disable-next-line max-len -->
          <q-card v-for="store in onSearchTextChange" :key="store.id" class="my-card force-shadow-10 q-ma-md" flat bordered @click="onClickStoreCard(store)">
            <q-card-section horizontal>
              <q-card-section class=col-5 flex flex-center>
                <q-img
                  class="col"
                  :src="store.img_url"
                />
              </q-card-section>

              <q-card-section class="q-pt-xs">
                <div class="text-h5 q-mt-sm q-mb-xs">{{ store.store_name || 'Missing Name' }}</div>
                <div class="text-caption text-grey">
                  <!-- eslint-disable-next-line max-len -->
                  {{ store.lot }}
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </q-dialog>
    <store-dialog :storeInfo="activeCard" ref="dialog" @get-direction="getDirection" />
  </div>
</template>
<script>
import firebase from 'src/boot/firebase';
import StoreDialog from './StoreDialog.vue';

export default {
  components: {
    StoreDialog,
  },
  data() {
    return {
      isShow: false,
      maximizedToggle: true,
      searchText: '',
      stores: [],
      filteredStore: [],
      category: '',
      activeCard: {
        storeId: '',
        storeName: '',
        storeType: '',
        storeDescription: '',
        mainImageUrl: '',
      },
    };
  },
  computed: {
    onSearchTextChange() {
      // eslint-disable-next-line max-len
      return this.searchText ? this.filteredStore.filter((store) => (store.store_name || '').toLowerCase().includes(this.searchText.toLowerCase())) : this.filteredStore;
    },
  },
  created() {
    firebase.db.collection('Store').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          /** *
           * floor: "LG"
            img_url: "https://www.midvalley.com.my/img/tenant/logo01Dec2020145820.jpg"
            lot: "LG-012"
            store_name: "Texas Chicken"
            type: "Restaurant, Quick Service/ Fast Food"
            id: "{id_of_the_store}"
           */
          const storeInfo = {};

          Object.assign(storeInfo, doc.data());
          storeInfo.id = doc.id;
          this.stores.push(storeInfo);
        });

        this.filteredStore = this.stores;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error getting documents: ', error);
      });
  },
  methods: {
    showDialog() {
      this.isShow = true;
    },
    filterStore(category) {
      this.category = category || '';
      this.filteredStore = this.stores.filter((store) => (store.type || '').toLowerCase().includes(this.category.toLowerCase()));
    },
    onClickStoreCard(store) {
      this.activeCard = store;
      this.$refs.dialog.showDialog();
      this.isShow = false;
    },
    getDirection(store) {
      this.$emit('get-direction', store);
    },
  },
};
</script>
<style scoped>
    .force-shadow-10 {
      box-shadow:
      0 6px 6px -3px rgb(25 118 210 / 20%),
      0 10px 14px 1px rgb(25 118 210 / 14%),
      0 4px 18px 3px rgb(25 118 210 / 12%) !important;
    }
</style>
