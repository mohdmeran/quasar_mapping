<template :name="name">
<q-page class="window-height window-width row justify-center items-end">
  <!-- eslint-disable-next-line max-len -->
  <l-map :center="map.center" :options="{zoomControl: false}" :minZoom="-1" :zoom="-1" class="absolute-top" style="z-index:0; height:93%; max-width:100%" :crs="crs">
    <l-image-overlay
      @click="getLat"
      :interactive="true"
      :url="floorplan"
      :bounds="[[0, 0], [708, 1993]]"></l-image-overlay>

      <l-polyline
      :visible="navigation.isNavigate"
      :lat-lngs="polyline.latlngs"
      :color="polyline.innerColor"
      :weight="polyline.baseWeight * 3"
      :lineCap="polyline.lineCap"
      :lineJoin="polyline.lineJoin">
    </l-polyline>
    <l-polyline
      :visible="navigation.isNavigate"
      :lat-lngs="polyline.latlngs"
      :color="polyline.color"
      :weight="polyline.baseWeight"
      :lineCap="polyline.lineCap"
      :lineJoin="polyline.lineJoin">
    </l-polyline>

    <l-circle
        :visible="position.show"
        :radius="20"
        :lat-lng="[position.currentPosition.y, position.currentPosition.x]"
        :fill="true"
        :stroke="false"
        :fillColor="'white'"
        :fillOpacity=".7"
        style="z-index:-3000"
      ></l-circle>
      <l-circle
        :visible="position.show"
        :radius="10"
        :lat-lng="[position.currentPosition.y, position.currentPosition.x]"
        :fill="true"
        :color="'#1976D2'"
        :fillColor="'#1976D2'"
        :fillOpacity="1"
        style="z-index:-3000"
      ></l-circle>

    <l-marker v-if="navigation.isNavigate" :lat-lng="navigation.destination"></l-marker>
    <l-image-overlay
      :interactive="true"
      v-for="store in stores"
      :key="store.store_name"
      :url="store.img_url"
      @click="onClickStoreImage(store)"
      :bounds="[
        [store.bounds[0]],
        [store.bounds[1]]
      ]"></l-image-overlay>

    <l-control-zoom position="bottomright"  ></l-control-zoom>
  </l-map>
  <!-- eslint-disable-next-line max-len -->
  <q-btn align="left" class="q-mx-lg absolute-top shadow-4" style="background: white !important; top:10px; width:87%" outline rounded color="primary" @click="onClickSearchButton('')">
      <q-icon left size="1.5em" name="fas fa-search" />
      <!-- eslint-disable-next-line max-len -->
      <div class="text-black">S<span class="text-lowercase">earch stores...</span></div>
  </q-btn>
  <search-dialog ref="dialog" @get-direction="onClickGetDirectionButton"/>
  <select-nearby-dialog ref="nearbydialog" @select-nearby-store="onSelectNearbyStore" />
  <!-- eslint-disable-next-line max-len -->
  <store-dialog :storeInfo="cardStore.activeCard.storeInfo" ref="storeDialog" @get-direction="onClickGetDirectionButton" />
  <!-- eslint-disable-next-line max-len -->
  <transition
  appear
  enter-active-class="animated bounceInUp"
  leave-active-class="animated bounceOutDown"
  :animation="3000"
  >
  <!-- Wrapping only one DOM element, defined by QBtn -->
  <!-- eslint-disable-next-line max-len -->
  <navigation-dialog class="shadow-15" v-show="navigation.isNavigate" :store="navigation.store" @exit="stopNavigation"/>
</transition>
</q-page>
</template>

<script>

// DON'T load Leaflet components here!
// Its CSS is needed though, if not imported elsewhere in your application.
import 'leaflet/dist/leaflet.css';
import { useQuasar } from 'quasar';
import { CRS } from 'leaflet';
import {
  LMap, LImageOverlay, LPolyline, LCircle, LControlZoom, LMarker,
} from '@vue-leaflet/vue-leaflet';
import firebase from 'src/boot/firebase';
import matrixGridSaved from './miscellaneous/lgGrid.js';
import SearchDialog from '../components/SearchDialog.vue';
import StoreDialog from '../components/StoreDialog.vue';
import NavigationDialog from '../components/NavigationDialog.vue';
import SelectNearbyDialog from '../components/SelectNearbyDialog.vue';

const PF = require('pathfinding');

const matrixGrid = JSON.parse(matrixGridSaved);

const grid = new PF.Grid(matrixGrid);
const finder = new PF.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: false,
});

export default {
  name: 'pageMap',
  components: {
    LMap,
    LImageOverlay,
    LPolyline,
    LCircle,
    LControlZoom,
    SearchDialog,
    StoreDialog,
    NavigationDialog,
    LMarker,
    SelectNearbyDialog,
  },
  data() {
    return {
      map: {
        center: [425, 1063],
      },
      select: {
        showDialog: false,
        from: Object,
      },
      navigation: {
        isNavigate: false,
        store: {},
        destination: [0, 0],
      },
      cardStore: {
        activeCard: {
          storeInfo: {},
        },
      },
      timer: Object,
      timer_count: 0,
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
          x: 218,
          y: 404,
        },
        distances: [],
        show: true,
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
    const $q = useQuasar();

    if ($q.platform.is.cordova) {
      this.scanWifi(true);

      this.timer = setInterval(() => {
        this.scanWifi();
      }, 1000);
    } else {
      this.position.show = false;
      this.map.center = [425, 1063];
    }

    firebase.db.collection('LG_Lot').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
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
          storeInfo.bounds = JSON.parse(storeInfo.bounds);

          // get store data
          if (storeInfo.store_ref) {
            storeInfo.store_ref.get().then((storeDoc) => {
              storeInfo = Object.assign(storeInfo, storeDoc.data());
              this.stores.push(storeInfo);
            });
          }
        }
      });

      if (this.$route.params.isNavigate) {
        this.onClickGetDirectionButton(JSON.parse(this.$route.params.store));
      }
    });
  },
  computed: {
    floorplan() {
      // eslint-disable-next-line global-require
      return require('../assets/LgFloor.svg');
    },
  },
  methods: {
    async requestFB() {
      await firebase.db.collection('AP').get().then((querySnapshot) => {
        this.firebase.querySnapshot = querySnapshot;
      });
    },
    async scanWifi(setCenter = false) {
      if (this.scan.isScan) return;

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
        this.position.distances = { x: 0, y: 0 };
      }

      if (setCenter) {
        this.map.center = [this.position.currentPosition.y, this.position.currentPosition.x];
      }

      this.scan.isScan = false;
    },
    onClickGetDirectionButton(store) {
      this.navigation.isNavigate = false;

      if (this.position.show) {
        this.findDirection(store.lot ? store.lot : 'LG-01');
      } else {
        this.select.from = store;
        this.$refs.nearbydialog.showDialog();
      }

      this.navigation.store = store;
    },
    onSelectNearbyStore(store) {
      const docRef = firebase.db.collection('LG_Lot').doc(store.lot ? store.lot : 'LG-01');

      docRef.get().then((doc) => {
        if (doc.exists) {
          const [lat, lng] = doc.data().entrance;
          this.position.currentPosition = { x: lng, y: lat };
          this.findDirection(this.select.from.lot ? this.select.from.lot : 'LG-01');
        } else {
          // eslint-disable-next-line no-throw-literal
          throw 'no such document';
        }
      }).catch((error) => {
        this.timer_count = `Error getting document: ${error}`;
        // eslint-disable-next-line no-console
        console.log('Error getting document:', error);
      });
    },
    async findDirection(lot) {
      const docRef = firebase.db.collection('LG_Lot').doc(lot);

      docRef.get().then((doc) => {
        if (doc.exists) {
          this.timer_count = doc.data().entrance;
          const [lat, lng] = doc.data().entrance;

          this.setPath({ lat, lng });
          this.navigation.destination = [lat, lng];
          this.map.center = this.navigation.destination;
          this.navigation.isNavigate = true;
        } else {
        // doc.data() will be undefined in this case
          this.timer_count = 'No such document!';
          // eslint-disable-next-line no-console
          console.log('No such document!');
        }
      }).catch((error) => {
        this.timer_count = `Error getting document: ${error}`;
        // eslint-disable-next-line no-console
        console.log('Error getting document:', error);
      });
    },
    async setPath(endPoint) {
      const endPointIndexes = this.cordsToIndex(endPoint);
      // eslint-disable-next-line max-len
      const startPointIndexes = this.cordsToIndex({ lat: this.position.currentPosition.y, lng: this.position.currentPosition.x });

      const path = finder.findPath(
        startPointIndexes.x,
        startPointIndexes.y,
        endPointIndexes.x,
        endPointIndexes.y,
        grid.clone(),
      );

      this.polyline.latlngs = this.translatePath(path);
    },
    getLat(event) {
      // eslint-disable-next-line no-console
      console.log(event);
    },
    cordsToIndex(cords) {
      const x = Math.ceil(cords.lng);
      const y = matrixGrid.length - Math.ceil(cords.lat);

      return { x, y };
    },
    indexToCords(indexes) {
      const yMaxLen = matrixGrid.length;
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
    onClickSearchButton(category) {
      this.$refs.dialog.filterStore(category);
      this.$refs.dialog.showDialog();
    },
    onClickStoreImage(store) {
      this.cardStore.activeCard.storeInfo = store;
      this.$refs.storeDialog.showDialog();
    },
    stopNavigation() {
      this.navigation.isNavigate = false;
    },
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
};
</script>
