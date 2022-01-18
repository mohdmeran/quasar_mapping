<template>
<!-- <div class="div">{{ position.distances }}</div> -->
<q-page class="window-height window-width row justify-center items-center">
    <l-map :minZoom="-1" :zoom="-1" class="absolute-center" style="height:100vh" :crs="crs">
        <l-image-overlay
        @click="onClickMap"
        :interactive="true"
        :url="floorplan"
        :bounds="[[0, 0], [708, 1993]]"></l-image-overlay>
        <l-circle
            v-for="item in empty_lot" :key="item.lot"
            :radius="8"
            :lat-lng="[item.lat, item.lng]"
            @click="setupStoreDialog(item.lot, item.lat, item.lng)"
            :fill="true"
            :color="'#009933'"
            :fillColor="'#009933'"
            :fillOpacity="1"
        >
        </l-circle>
        <l-image-overlay
        v-for="store in stores"
        :key="store.store_name"
        :url="store.img_url"
        :bounds="[
            store.bounds[0],
            store.bounds[1]
        ]"></l-image-overlay>
    </l-map>
    <div>
        <q-btn
        color="primary"
        label="Add Lot" @click="lot.isAddLot = true; action.addLot.isSelectEntrance = true" />
    </div>

    <q-dialog v-model="lot.dialog.show" persistent>
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6">{{ `Lat: ${lot.lat} | Lng: ${lot.lng}` }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input dense label="Lot name (id)" v-model="lot.dialog.lot_name" autofocus />
                <q-input
                dense label="Entrance [lat, lng]" v-model="lot.dialog.entrance" autofocus />
                <q-input dense label="Bounds [[],[]]" v-model="lot.dialog.bounds" autofocus />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup @click="lot.isAddLot = false" />
            <q-btn flat label="Add Lot" v-close-popup @click="addLot" />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <q-dialog v-model="store.dialog.show" persistent>
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6">
                    {{ `Lat: ${store.form.lat} | Lng: ${store.form.lng}` }}
                </div>
                <div>
                    {{ `Lot: ${store.form.lot}`}}
                </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input dense label="Store name" v-model="store.form.store_name" autofocus />
                <q-input dense label="Type" v-model="store.form.type" autofocus />
                <q-input dense label="Image URL" v-model="store.form.img_url" autofocus />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Add Store" v-close-popup @click="addStore" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</q-page>
</template>

<script>

// DON'T load Leaflet components here!
// Its CSS is needed though, if not imported elsewhere in your application.
import 'leaflet/dist/leaflet.css';
import { CRS } from 'leaflet';
import {
  LMap, LImageOverlay, LCircle,
} from '@vue-leaflet/vue-leaflet';
import firebase from 'src/boot/firebase';

export default {
  components: {
    LMap,
    LImageOverlay,
    LCircle,
  },
  data() {
    return {
      action: {
        addLot: {
          isSelectEntrance: false,
          isSelectStartBound: false,
          isSelectEndBound: false,
        },
      },
      lot: {
        isAddLot: false,
        lat: '',
        lng: '',
        dialog: {
          show: false,
          bounds: [],
          lot_name: '',
          entrance: [],
        },
      },
      store: {
        dialog: {
          show: false,
        },
        form: {
          lat: '',
          lng: '',
          floor: '',
          lot: '',
          store_name: '',
          img_url: '',
          type: '',
        },
      },
      dialog: {
        show: false,
        store_name: '',
        type: '',
        img_url: '',
        lot: '',
        bounds: '',
      },
      firebase: {
        querySnapshot: [],
      },
      geojson: {
        type: 'FeatureCollection',
        features: [
          // ...
        ],
      },
      geojsonOptions: {
        // Options that don't rely on Leaflet methods.
      },
      crs: CRS.Simple,
      stores: [],
      empty_lot: [],
    };
  },
  mounted() {
    firebase.db.collection('LG_Lot').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          // remove from empty lot if store added
          if (change.doc.data().store_ref) {
            this.empty_lot = this.empty_lot.filter(
              (item) => !(item.lot === change.doc.id),
            );
          }
          // eslint-disable-next-line no-console
          console.log(this.empty_lot);
        }

        if (change.type === 'added' || change.type === 'modified') {
          let storeInfo = {
            store_name: '',
            lat: '',
            lng: '',
            img_url: '',
            type: '',
            lot: '',
            bounds: [],
          };
          storeInfo.lot = change.doc.id;
          storeInfo = Object.assign(storeInfo, change.doc.data());

          if (storeInfo.store_ref) {
            storeInfo.store_ref.get().then((storeDoc) => {
              storeInfo = Object.assign(storeInfo, storeDoc.data());
              storeInfo.bounds = JSON.parse(storeInfo.bounds);
              this.stores.push(storeInfo);
            });
          } else {
            this.empty_lot.push(storeInfo); // if lot no store, push to empty
          }
        }
        if (change.type === 'removed') {
          // eslint-disable-next-line no-console
          console.log('Removed city: ', change.doc.data());
          this.success = change.doc.data();
        }
      });
    });
  },
  computed: {
    floorplan() {
      // eslint-disable-next-line global-require
      return require('../assets/lgFloor.svg');
    },
  },
  methods: {
    onClickMap(event) {
      // eslint-disable-next-line no-console
      console.log(event);

      if (!this.lot.isAddLot) return;

      if (this.action.addLot.isSelectEntrance) {
        this.action.addLot.isSelectEntrance = false;

        this.lot.dialog.entrance = `[${event.latlng.lat}, ${event.latlng.lng}]`;
        this.action.addLot.isSelectStartBound = true;

        // eslint-disable-next-line no-console
        console.log('Please select startBound');

        return;
      }

      if (this.action.addLot.isSelectStartBound) {
        this.action.addLot.isSelectStartBound = false;

        this.lot.dialog.bounds = `[[${event.latlng.lat}, ${event.latlng.lng}], `;
        this.action.addLot.isSelectEndBound = true;

        // eslint-disable-next-line no-console
        console.log('Please select endBound');

        return;
      }

      if (this.action.addLot.isSelectEndBound) {
        this.action.addLot.isSelectEndBound = false;

        this.lot.dialog.bounds += `[${event.latlng.lat}, ${event.latlng.lng}]]`;

        // eslint-disable-next-line no-console
        console.log('Setup finished :) please select lot location');
        return;
      }

      this.lot.lat = event.latlng.lat;
      this.lot.lng = event.latlng.lng;

      this.lot.dialog.show = true;
    },
    addLot() {
      this.lot.isAddLot = false;

      firebase.db.collection('LG_Lot').doc(this.lot.dialog.lot_name).set({
        bounds: this.lot.dialog.bounds,
        lat: this.lot.lat,
        lng: this.lot.lng,
        entrance: JSON.parse(this.lot.dialog.entrance),
      }).then(() => {
        // handle success
      })
        .catch(() => {
          // handle error
        });
    },
    addStore() {
      // add to Store collection
      firebase.db.collection('Store').add({
        floor: 'LG',
        img_url: this.store.form.img_url,
        lot: this.store.form.lot,
        store_name: this.store.form.store_name,
        type: this.store.form.type,
      }).then((docRef) => {
        firebase.db.collection('LG_Lot').doc(this.store.form.lot).update({
          store_ref: docRef,
        }).then(() => {
          // handle success
        });
      })
        .catch(() => {
          // handle errror
        });

      // update lot information
    },
    setupStoreDialog(lot, lat, lng) {
      this.store.form.lot = lot;
      this.store.form.lat = lat;
      this.store.form.lng = lng;

      this.store.dialog.show = true;
    },
  },
};
</script>
