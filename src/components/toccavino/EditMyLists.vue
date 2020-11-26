<template>
  <div class="myListsBox">
    <!-- <div v-for="(event, i) in events" :key="i + '_event'">
      {{ event }}
    </div> -->
    <v-data-table :headers="headers" :items="events" class="elevation-1">
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:[`item.media`]="{ item }">
        <v-img
          v-if="item.media"
          :src="item.media[0]"
          class="grey lighten-2 mainImg"
          :aspect-ratio="16 / 9"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { db } from "../../main";
import firebase from "firebase";

export default {
  data() {
    return {
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "name",
        },
        {
          text: "Description",
          align: "start",
          sortable: false,
          value: "description",
        },
        {
          text: "Date",
          align: "start",
          sortable: true,
          value: "date",
        },
        {
          text: "City",
          align: "start",
          sortable: true,
          value: "city",
        },
        {
          text: "Address",
          align: "start",
          sortable: true,
          value: "address",
        },
        {
          text: "Price",
          align: "start",
          sortable: true,
          value: "price",
        },
        {
          text: "Media",
          align: "start",
          sortable: true,
          value: "media",
        },
        { text: "Actions", value: "actions", sortable: false },
        // { text: "Fat (g)", value: "fat" },
        // { text: "Carbs (g)", value: "carbs" },
        // { text: "Protein (g)", value: "protein" },
        // { text: "Iron (%)", value: "iron" },
      ],
      events: [],
      cellars: [],
    };
  },
  mounted() {
    this.getUserEvents();
    this.getUserCellars();
  },
  methods: {
    getUserEvents() {
      var events = [];
      db.collection("wineEvents")
        .where("userId", "==", firebase.auth().currentUser.uid)
        .get()
        .then((querySnapshot) => {
          events = querySnapshot.docs.map((doc) => doc.data());
          console.log(events);
          this.events = events;
        })
        .catch((err) => console.log(err));
    },
    getUserCellars() {
      var cellars = [];
      db.collection("cellars")
        .where("userId", "==", firebase.auth().currentUser.uid)
        .get()
        .then((querySnapshot) => {
          cellars = querySnapshot.docs.map((doc) => doc.data());
          console.log(cellars);
          this.cellars = cellars;
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
<style lang="scss">
.myListsBox {
  width: 100%;
}
</style>