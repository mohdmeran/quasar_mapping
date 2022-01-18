<template>
    <q-page class="window-height window-width q-pa-lg">
        <!-- eslint-disable-next-line max-len -->
        <q-btn align="left" class="full-width shadow-4" outline rounded color="primary">
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
                    v-for="category in test"
                    :key="category.name"
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
            <promo-card logo="logo/starbuck_logo.png" store="Starbuck" promoText="50% Off" />
        </div>
    </q-page>
</template>
<script>
import PromoCard from '../components/PromoCard.vue';

export default {
  components: {
    PromoCard,
  },
  data() {
    return {
      searchModel: '',
      categories: [
        [
          { name: 'beauty & wellness', icon: 'fas fa-air-freshener' },
          { name: 'fashion', icon: 'fas fa-vest-patches' },
          { name: 'homes', icon: 'fas fa-couch' },
        ],
        [
          { name: 'food & beverages', icon: 'fas fa-hamburger' },
          { name: 'kids', icon: 'fas fa-child' },
          { name: 'fun', icon: 'fas fa-futbol' },
        ],
        [
          { name: 'IT & gadget', icon: 'fas fa-power-off' },
          { name: 'sundry & services', icon: 'fas fa-wrench' },
          { name: 'store & market', icon: 'fas fa-cash-register' },
        ],
      ],
      test: [
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
    };
  },
};
</script>
<style scoped>
    .scroll {
overflow: hidden;}
</style>
