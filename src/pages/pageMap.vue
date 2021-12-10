<template>
  <l-map style="height:100vh" :crs="crs">
    <l-image-overlay
      @click="getLat"
      :interactive="true"
      :url="floorplan"
      :bounds="[[0, 0], [657, 441]]"></l-image-overlay>
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
  </l-map>
</template>

<script>
// DON'T load Leaflet components here!
// Its CSS is needed though, if not imported elsewhere in your application.
import 'leaflet/dist/leaflet.css';
import { CRS } from 'leaflet';
import {
  LMap, LImageOverlay, LPolyline,
} from '@vue-leaflet/vue-leaflet';
import db from 'src/boot/firebase';
import matrixGrid from './miscellaneous/grid';

const PF = require('pathfinding');

const grid = new PF.Grid(matrixGrid.matrixGrid);
const finder = new PF.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true,
});

export default {
  components: {
    LMap,
    LImageOverlay,
    LPolyline,
  },
  async created() {
    // eslint-disable-next-line no-undef
    this.success = await WifiWizard2.scan();
  },
  data() {
    return {
      success: 'load',
      polyline: {
        latlngs: [[0, 0], [0, 0]],
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
    };
  },
  mounted() {
    db.collection('AP').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          // eslint-disable-next-line no-console
          console.log('New city: ', change.doc.data());
          this.success = change.doc.data();
        }
        if (change.type === 'modified') {
          // eslint-disable-next-line no-console
          console.log('Modified city: ', change.doc.data());
          this.success = change.doc.data();
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
      return require('../assets/hillpark-floorplan.svg');
    },
  },
  methods: {
    getLat(event) {
      const endPoint = {
        lat: 586, // y
        lng: 392, // x
      };

      // eslint-disable-next-line no-console
      console.log(event);
      const endPointIndexes = this.cordsToIndex(endPoint);
      const startPointIndexes = this.cordsToIndex(event.latlng);

      // eslint-disable-next-line no-unused-vars
      const path = finder.findPath(
        startPointIndexes.x,
        startPointIndexes.y,
        endPointIndexes.x,
        endPointIndexes.y,
        grid.clone(),
      );

      this.polyline.latlngs = this.translatePath(path);
    },
    cordsToIndex(cords) {
      const len = 9;

      const x = Math.ceil(cords.lng / len) - 1;
      const y = matrixGrid.matrixGrid.length - Math.ceil(cords.lat / len);

      return { x, y };
    },
    indexToCords(indexes) {
      const yMaxLen = 657;
      const lng = 9 * indexes[0] + 5;
      const lat = yMaxLen - (indexes[1] * 9 + 5);

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
