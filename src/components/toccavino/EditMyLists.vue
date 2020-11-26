<template>
  <div class="myListsBox">
    <div class="listHeader">
      <router-link class="btn nav-button" :to="{ name: 'toccaVinoHome' }">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h3>my lists editor</h3>
    </div>

    <!-- modal event-->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete this event?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="primary" text @click="deleteEventConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- modal cellar-->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete this cellar?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="primary" text @click="deleteCellarConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- events -->
    <h2>Events</h2>
    <v-data-table :headers="headersEvents" :items="events" class="elevation-1">
      <template v-slot:[`item.actions`]="{ item }">
        <router-link
          class="iconLink"
          :to="{ name: 'toccaVinoEditEvent', params: { id: item.id } }"
        >
          <v-icon small class="mr-2" @click="editItem(item.id)">
            mdi-pencil
          </v-icon>
        </router-link>
        <v-icon small class="mr-2" @click="deleteEvent(item.id, item)">
          mdi-delete
        </v-icon>
        <a
          class="iconLink"
          :href="`https://www.google.com/maps/@${item.location.latitude},${item.location.longitude},15z`"
          ><v-icon small> mdi-google-maps </v-icon></a
        >
      </template>
      <template v-slot:[`item.media`]="{ item }">
        <v-img
          v-if="item.media"
          :src="item.media[0]"
          class="grey lighten-2 myImageList"
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

    <!-- cellars -->
    <h2>Cellars</h2>
    <v-data-table
      :headers="headersCellars"
      :items="cellars"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <router-link
          class="iconLink"
          :to="{ name: 'toccaVinoEditEvent', params: { id: item.id } }"
        >
          <v-icon small class="mr-2" @click="editItem(item.id)">
            mdi-pencil
          </v-icon>
        </router-link>

        <v-icon small class="mr-2" @click="deleteCellar(item.id, item)">
          mdi-delete
        </v-icon>
        <a
          class="iconLink"
          :href="`https://www.google.com/maps/@${item.location.latitude},${item.location.longitude},15z`"
          ><v-icon small> mdi-google-maps </v-icon></a
        >
      </template>
      <template v-slot:[`item.media`]="{ item }">
        <v-img
          v-if="item.media"
          :src="item.media[0]"
          class="grey lighten-2 myImageList"
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
      dialogDelete: false,
      headersCellars: [
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
          text: "Media",
          align: "start",
          sortable: true,
          value: "media",
        },
        {
          text: "Cellar Type",
          align: "start",
          sortable: true,
          value: "cellarType",
        },
        { text: "Actions", value: "actions", sortable: false },
      ],
      headersEvents: [
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
      ],
      events: [],
      cellars: [],
      idToDelete: null,
      indexToDelete: null,
    };
  },
  created() {
    this.$store.commit("toggleHomePage", false);

    this.getUserEvents();
    this.getUserCellars();
  },
  methods: {
    editItem(id) {
      console.log(id);
    },
    deleteEvent(id, item) {
      this.dialogDelete = true;
      this.idToDelete = id;
      this.indexToDelete = this.events.indexOf(item);
    },
    async deleteEventConfirm() {
      this.events.splice(this.indexToDelete, 1);
      console.log(this.idToDelete);
      await db.collection("wineEvents").doc(this.idToDelete).delete();
      this.closeDelete();
    },
    deleteCellar(id, item) {
      this.dialogDelete = true;
      this.idToDelete = id;
      this.indexToDelete = this.events.indexOf(item);
    },
    async deleteCellarConfirm() {
      this.cellars.splice(this.indexToDelete, 1);
      console.log(this.idToDelete);
      await db.collection("cellars").doc(this.idToDelete).delete();
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      // this.$nextTick(() => {
      //   this.editedItem = Object.assign({}, this.defaultItem)
      //   this.editedIndex = -1
      // })
    },
    getUserEvents() {
      var events = [];
      db.collection("wineEvents")
        .where("userId", "==", firebase.auth().currentUser.uid)
        .get()
        .then((querySnapshot) => {
          events = querySnapshot.docs.map((doc) => {
            var res = new Object(doc.data());
            res["id"] = doc.id;
            return res;
          });
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
          cellars = querySnapshot.docs.map((doc) => {
            var res = new Object(doc.data());
            res["id"] = doc.id;
            return res;
          });
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
.listHeader {
  width: 100%;
  height: 50px;
  background: rgb(202, 202, 202);
  display: flex;
  align-items: center;
}
.iconLink {
  &:hover {
    text-decoration: none !important;
  }
}
</style>