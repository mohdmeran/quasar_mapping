<template>
<!-- <div class="div">{{ position.distances }}</div> -->
<q-page class="window-height window-width row justify-center items-end">
  <l-map :minZoom="-1" :zoom="-1" class="absolute-center" style="height:100vh" :crs="crs">
    <l-image-overlay
      @click="getLat"
      :interactive="true"
      :url="floorplan"
      :bounds="[[0, 0], [708, 1993]]"></l-image-overlay>
    <l-polyline
      :lat-lngs="polyline.latlngs"
      :color="polyline.innerColor"
      :weight="polyline.baseWeight * 3"
      :lineCap="polyline.lineCap"
      :lineJoin="polyline.lineJoin">
    </l-polyline>
    <l-polyline
      :lat-lngs="polyline.latlngs"
      :color="polyline.color"
      :weight="polyline.baseWeight"
      :lineCap="polyline.lineCap"
      :lineJoin="polyline.lineJoin">
    </l-polyline>
    <l-image-overlay
      v-for="store in stores"
      :key="store.store_name"
      :url="store.img_url"
      :bounds="[
        [store.bounds[0], store.bounds[1]],
        [store.bounds[2], store.bounds[3]]
      ]"></l-image-overlay>
    <l-circle
        :radius="10"
        :lat-lng="[position.currentPosition.y, position.currentPosition.x]"
        :fill="true"
        :color="'#1976D2'"
        :fillColor="'#1976D2'"
        :fillOpacity="1"
      >
    </l-circle>
  </l-map>
  <div>
      <q-btn @click="scanWifi" color="primary" label="Start " />
  </div>
  <div>
      <q-btn @click="changeText" color="primary" label="change text " />
  </div>
  <div v-if="scan.isScan" class="div">
    Scanning...
  </div>
</q-page>
</template>

<script>

// DON'T load Leaflet components here!
// Its CSS is needed though, if not imported elsewhere in your application.
import 'leaflet/dist/leaflet.css';
import { CRS } from 'leaflet';
import {
  LMap, LImageOverlay, LPolyline, LCircle,
} from '@vue-leaflet/vue-leaflet';
import firebase from 'src/boot/firebase';
import matrixGrid from './miscellaneous/lgGrid.js';

const PF = require('pathfinding');

const grid = new PF.Grid(matrixGrid.matrixGrid);
const finder = new PF.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: false,
});

export default {
  components: {
    LMap,
    LImageOverlay,
    LPolyline,
    LCircle,
  },
  data() {
    return {
      firebase: {
        querySnapshot: [],
      },
      scan: {
        isScan: false,
        result: [],
        found: [],
      },
      position: {
        currentPosition: {
          x: 0,
          y: 0,
        },
        distances: [],
      },
      polyline: {
        latlngs: [[404, 218], [404, 220]],
        color: '#7BD5FB',
        innerColor: 'black',
        baseWeight: 4,
        lineCap: 'square',
        lineJoin: 'round',
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
    };
  },
  async created() {
    await this.requestFB();
  },
  mounted() {
    firebase.db.collection('LG_Lot').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let storeInfo = {
          store_name: '',
          lat: '',
          lng: '',
          img_url: '',
          type: '',
          lot: '',
        };

        storeInfo.lot = doc.id;
        storeInfo = Object.assign(storeInfo, doc.data());

        storeInfo.store_ref.get().then((storeDoc) => {
          storeInfo = Object.assign(storeInfo, storeDoc.data());
        });
        // eslint-disable-next-line no-console
        console.log(storeInfo);

        this.stores.push(storeInfo);
      });
    });
    // firebase.db.collection('AP').onSnapshot((snapshot) => {
    //   snapshot.docChanges().forEach((change) => {
    //     if (change.type === 'added') {
    //       // eslint-disable-next-line no-console
    //       console.log('New city: ', change.doc.data());
    //       this.success = change.doc.data();
    //     }
    //     if (change.type === 'modified') {
    //       // eslint-disable-next-line no-console
    //       console.log('Modified city: ', change.doc.data());
    //       this.success = change.doc.data();
    //     }
    //     if (change.type === 'removed') {
    //       // eslint-disable-next-line no-console
    //       console.log('Removed city: ', change.doc.data());
    //       this.success = change.doc.data();
    //     }
    //   });
    // });
  },
  computed: {
    floorplan() {
      // eslint-disable-next-line global-require
      return require('../assets/lgFloor.svg');
    },
  },
  methods: {
    changeText() {
      // eslint-disable-next-line no-console
      console.log('test');
      this.position.distances = 'changeText';
    },
    async requestFB() {
      await firebase.db.collection('AP').get().then((querySnapshot) => {
        this.firebase.querySnapshot = querySnapshot;
      });
    },
    async scanWifi() {
      this.scan.isScan = true;
      try {
        let distances = [];
        this.scan.result = [];
        // eslint-disable-next-line no-undef
        this.scan.result = await WifiWizard2.scan();

        this.firebase.querySnapshot.forEach((doc) => {
          const { id } = doc;
          let distance = 0;

          doc.data().items.forEach((fbaseAP) => {
            const found = this.scan.result.find((AP) => AP.BSSID === fbaseAP.BSSID);
            this.scan.found.push(found);
            distance += found ? Math.abs(fbaseAP.level - found.level) : Math.abs(fbaseAP.level);
          });

          distances.push({
            id,
            distance: Math.sqrt(distance),
            position: doc.data().location,
          });
        });
        this.position.distances = distances;

        // check which position is closer
        distances = distances.sort(
          (a, b) => ((a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0)),
        );

        this.position.currentPosition = { x: distances[0].position.x, y: distances[0].position.y };
      } catch (e) {
        this.position.distances = e;
      }

      this.scan.isScan = false;
    },
    getLat(event) {
      const endPoint = {
        lat: 393, // y
        lng: 206, // x
      };

      // eslint-disable-next-line no-console
      console.log(event);
      const endPointIndexes = this.cordsToIndex(endPoint);
      const startPointIndexes = this.cordsToIndex(event.latlng);

      const path = finder.findPath(
        startPointIndexes.x,
        startPointIndexes.y,
        endPointIndexes.x,
        endPointIndexes.y,
        grid.clone(),
      );

      this.polyline.latlngs = this.translatePath(path);
      // eslint-disable-next-line no-console
      console.log('done');
    },
    cordsToIndex(cords) {
      const x = Math.ceil(cords.lng);
      const y = matrixGrid.matrixGrid.length - Math.ceil(cords.lat);

      return { x, y };
    },
    indexToCords(indexes) {
      const yMaxLen = matrixGrid.matrixGrid.length;
      const lng = indexes[0];
      const lat = yMaxLen - (indexes[1]);

      return { lng, lat };
    },
    translatePath(paths) {
      const final = [];

      paths.forEach((indexes) => {
        const latlng = this.indexToCords(indexes);

        final.push([latlng.lat, latlng.lng]);
      });

      return final;
    },
  },
};
</script>
