<template>
    <q-page class="window-height window-width q-pa-lg">
        <!-- eslint-disable-next-line max-len -->
        <q-btn align="left" class="full-width shadow-4" outline rounded color="primary" @click="onClickSearchButton('')">
            <q-icon left size="1.5em" name="fas fa-search" />
            <!-- eslint-disable-next-line max-len -->
            <div class="text-black">S<span class="text-lowercase">earch stores...</span></div>
        </q-btn>

        <div>
            <h3 class="text-h5 text-bold text-black">Categories</h3>
            <!-- eslint-disable-next-line max-len -->
            <q-scroll-area :visible="false" style="height: 150px; max-width: 400px;">
                <div class="row no-wrap q-gutter-md absolute">
                    <q-btn
                    outline
                    stack
                    class="shadow-3 col"
                    padding="lg"
                    color="primary"
                    v-for="category in categories"
                    :key="category.name"
                    @click="onClickSearchButton(category.name)"
                    >
                        <!-- eslint-disable-next-line vue/no-parsing-error -->
                        <q-icon size="1.5em" :name="category.icon" />
                        <!-- eslint-disable-next-line max-len -->
                        <div class="q-mt-sm" style="font-size: 9px; line-height: 1.6">{{ category.name }}</div>
                    </q-btn>
                </div>
            </q-scroll-area>
        </div>

        <div>
            <h3 class="text-h5 text-bold text-black">Deals</h3>
            <promo-card class="q-mt-sm" v-for="deal in deals" :key="deal"
            :store="deal.store" :promoText="deal.description" />
        </div>
        <search-dialog ref="dialog"/>
    </q-page>
</template>
<script>
import firebase from 'src/boot/firebase';
import PromoCard from '../components/PromoCard.vue';
import SearchDialog from '../components/SearchDialog.vue';

export default {
  components: {
    PromoCard,
    SearchDialog,
  },
  data() {
    return {
      searchModel: '',
      categories: [
        { name: 'beauty & wellness', icon: 'fas fa-air-freshener' },
        { name: 'fashion', icon: 'fas fa-vest-patches' },
        { name: 'homes', icon: 'fas fa-couch' },
        { name: 'food & beverages', icon: 'fas fa-hamburger' },
        { name: 'kids', icon: 'fas fa-child' },
        { name: 'fun', icon: 'fas fa-futbol' },
        { name: 'IT & gadget', icon: 'fas fa-power-off' },
        { name: 'sundry & services', icon: 'fas fa-wrench' },
        { name: 'store & market', icon: 'fas fa-cash-register' },
      ],
      deals: [],
    };
  },
  created() {
    this.getPromo();
  },
  methods: {
    onClickSearchButton(category) {
      this.$refs.dialog.filterStore(category);
      this.$refs.dialog.showDialog();
    },
    getPromo() {
      firebase.db.collection('Deals').get()
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

            firebase.db.collection('Store').doc(dealsInfo.store_id).get()
              .then((storeDoc) => {
                /** *
                   * floor: "LG"
                    img_url: "https://www.midvalley.com.my/img/tenant/logo01Dec2020145820.jpg"
                    lot: "LG-012"
                    store_name: "Texas Chicken"
                    type: "Restaurant, Quick Service/ Fast Food"
                    id: "{id_of_the_store}"
                  */
                const storeInfo = {};

                Object.assign(storeInfo, storeDoc.data());
                storeInfo.id = storeDoc.id;
                dealsInfo.store = storeInfo;
                this.deals.push(dealsInfo);
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.log('Error getting documents: ', error);
              });
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
<style scoped>
    .scroll {
overflow: hidden;}
</style>
