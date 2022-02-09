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

        <q-card-section class="q-pt-none">
          <h3 class="text-h5 text-bold text-black">Deals</h3>

          <!-- eslint-disable-next-line max-len -->
          <q-img v-for="deal in deals" :key="deal"
                :src="deal.img_url"
                :ratio="1"
              />
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
<script>
import firebase from 'src/boot/firebase';

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
      deals: [],
    };
  },
  mounted() {
    this.getPromoDo();
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
    getPromoDo() {
      // eslint-disable-next-line no-console
      console.log(this.storeInfo.id);
      firebase.db.collection('Deals').where('store_id', '==', String(this.storeInfo.id)).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
          /** *
           * description: "LG"
            img_url: "https://www.midvalley.com.my/img/tenant/logo01Dec2020145820.jpg"
            store_id: "LG-012"
           */
            const dealsInfo = { store: {} };

            Object.assign(dealsInfo, doc.data());
            dealsInfo.id = doc.id;

            this.deals.push(dealsInfo);
            // eslint-disable-next-line no-console
            console.log(dealsInfo);
          });
        })
        .catch((error) => {
        // eslint-disable-next-line no-console
          console.log('Error getting documents: ', error);
        });
    },
  },
};
</script>
