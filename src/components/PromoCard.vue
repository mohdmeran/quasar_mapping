<template>
    <div>
        <q-card class="my-card shadow-10">
            <q-card-section class="q-pa-md" horizontal>
                <q-img :src="src"  style="height: 80px; width: 80px"/>
                <q-card-section>
                    <div class="text-h5 text-weight-bold"> {{ store }} </div>
                    <div class="text-h6 text-weight-regular">{{ promoText }}</div>
                </q-card-section>

                <q-card-section class="row">
                    <q-btn color="primary" label="Visit" @click="showDialog" />
                </q-card-section>
            </q-card-section>
        </q-card>

        <store-dialog ref="dialog" />
    </div>
</template>
<script>
import firebase from 'src/boot/firebase';
import StoreDialog from './StoreDialog.vue';

export default {
  props: {
    logo: String,
    store: String,
    promoText: String,
  },
  components: {
    StoreDialog,
  },
  created() {
    // eslint-disable-next-line no-unused-vars
    const storageRef = firebase.storage.ref();
    storageRef.child(this.logo).getDownloadURL()
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'

        // Or inserted into an <img> element
        this.src = url;
      })
      .catch((error) => {
        // Handle any errors
        this.error = error;
      });
  },
  data() {
    return {
      stars: 5,
      error: '',
      src: '',
      dialog: {
        show: false,
      },
    };
  },
  methods: {
    showDialog() {
      this.$refs.dialog.showDialog();
    },
  },
};
</script>
