<template>
  <l-map :minZoom="-1" :zoom="-1" style="height:50vh" :crs="crs">
    <l-image-overlay
      @click="getLat"
      :interactive="true"
      :url="floorplan"
      :bounds="[[0, 0], [657, 441]]"></l-image-overlay>
    <l-circle
        v-for="item in mapped.items" :key="item"
        :radius="10"
        :lat-lng="[item.location.y, item.location.x]"
        :fill="true"
        :color="'#1976D2'"
        :fillColor="'#1976D2'"
        :fillOpacity="1"
      >
    </l-circle>
  </l-map>
  <div v-if="scan.isScanning">
    Scanning...
  </div>
  <div v-if="update.isDone">
    {{ update.text }}
  </div>
  <div v-if="scan.selectArea">
    Please select scanning area
  </div>
  <div>
      <q-btn @click="onStart" color="primary" label="Start " />
  </div>
  <q-dialog v-model="scan.complete">
      <q-card>
        <q-card-section>
          <div class="text-h6">Wifi scanned</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-pa-md" style="max-width: 350px">
            <q-list bordered separator>
              <q-item v-for="item in scan.items" :key= "item" clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ item.SSID }}</q-item-label>
                  <q-item-label caption>{{ item.level }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn @click="onSave()" flat label="OK" color="primary" v-close-popup />
          <!-- <q-btn flat label="Cancel" color="primary" v-close-popup /> -->
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
/* eslint-disable */
import 'leaflet/dist/leaflet.css';
import { CRS } from 'leaflet';
import {
  LMap, LImageOverlay, LCircle,
} from '@vue-leaflet/vue-leaflet';
// eslint-disable-next-line no-unused-vars
import db from 'src/boot/firebase';

export default {
  components: {
    LMap,
    LImageOverlay,
    LCircle,
  },
  data() {
    return {
      crs: CRS.Simple,
      scan: {
        pos: {
          x: '',
          y: '',
        },
        selectArea: false,
        isScanning: false,
        complete: false,
        items: [],
      },
      update: {
        isDone: false,
        text: '',
      },
      mapped: {
        items: [],
      },
    };
  },
  created() {
    db.collection('AP').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          // eslint-disable-next-line no-console
          console.log('New city: ', change.doc.data());
          this.mapped.items.push(change.doc.data());
        }
        if (change.type === 'modified') {
          this.success = change.doc.data();
        }
        if (change.type === 'removed') {
          // eslint-disable-next-line no-console
          console.log('Removed city: ', change.doc.data());
          this.mapped.items = this.mapped.items.filter((item) => {
            return !(item.location.x === change.doc.data().location.x && item.location.y === change.doc.data().location.y);
          })
        }
      });
    });
  },
  methods: {
    onStart() {
      this.scan.selectArea = true;
    },
    async onScan() {
      this.scan.isScanning = true;

      // eslint-disable-next-line no-undef
      this.scan.items = await WifiWizard2.scan();

      this.scan.isScanning = false;
      this.scan.complete = true;
    },
    onSave() {
      db.collection('AP').add({
        location: {
          x: this.scan.pos.x,
          y: this.scan.pos.y,
        },
        items: this.scan.items,
      })
        .then((docRef) => {
          this.update.text = `Document written with ID: ${docRef.id}`;
        })
        .catch((error) => {
          this.update.text = `Error adding document: ${error}`;
        });

      this.update.isDone = true;
    },
    getLat(event) {
      if (!this.scan.selectArea) return;

      this.scan.pos.x = event.latlng.lng;
      this.scan.pos.y = event.latlng.lat;

      this.scan.selectArea = false;
      this.onScan();
    },
  },
  computed: {
    floorplan() {
      // eslint-disable-next-line global-require
      return require('../assets/hillpark-floorplan.svg');
    },
  },
};
</script>
