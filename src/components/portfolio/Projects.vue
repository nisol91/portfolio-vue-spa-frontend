<template>
  <div
    class="projectsGallery d-flex justify-content-center align-items-center flex-column"
  >
    <div v-if="loading" class="splash-box">
      <v-progress-circular
        :size="70"
        color="blue-grey darken-3"
        indeterminate
        class="splash-box-progress"
      ></v-progress-circular>
    </div>
    <div v-if="!loading" class="filters">
      <v-chip-group column multiple class="chips">
        <v-chip
          filter
          outlined
          class="ma-2 projectsChip"
          filter-icon="mdi-plus"
          v-for="cat in cats"
          :key="cat"
          @click="filterByCat(cat)"
          >{{ cat }}</v-chip
        >
      </v-chip-group>
      <div class="orderBy" @click="orderByName">
        order by name
        <span
          ><i
            class="fas"
            :class="{
              'fa-arrow-up': toggleSearchByName,
              'fa-arrow-down': !toggleSearchByName,
            }"
          ></i
        ></span>
      </div>
    </div>
    <v-card
      v-for="project in filteredProjects"
      :key="project.id"
      class="projectCard"
    >
      <div class="projectTitle">
        <h1>{{ project.name }}</h1>
      </div>

      <div class="projCardDx">
        <div class="d-flex flex-column justify-content-center">
          <div class="projDescription">
            {{ project.description }}
          </div>
          <div class="text-align-center-center">
            technologies: {{ project.type }}
          </div>
        </div>
        <img
          v-if="project.img"
          class="projectImage"
          :src="project.img[0]"
          alt=""
        />
        <div v-if="!project.img" class="imgPlaceholder"></div>

        <v-btn v-if="project.disabled" color="" rounded dark disabled>
          <router-link
            id="routerInsideVButtonDisabled"
            class="d-flex justify-content-center align-items-center"
            :to="{ name: 'project', params: { id: project.id } }"
            >coming soon...
          </router-link></v-btn
        >
        <v-btn v-if="!project.disabled" color="primary" rounded dark>
          <router-link
            class="routerInsideVButton d-flex justify-content-center align-items-center"
            :to="{ name: 'project', params: { id: project.id } }"
            >to the project
          </router-link></v-btn
        >
      </div>
    </v-card>
  </div>
</template>
<script>
import _ from "lodash";
import { db } from "../../main";

export default {
  data() {
    return {
      projects: [],
      filteredProjects: [],

      cats: ["web", "mobile"],
      selectedCats: [],
      toggleSearchByName: true,
      loading: true,
    };
  },
  created() {
    this.$store.commit("toggleHomePage", false);
    this.getProjects();
  },
  computed: {},
  methods: {
    orderByName() {
      if (this.toggleSearchByName) {
        this.filteredProjects = _.orderBy(
          this.filteredProjects,
          [
            function (project) {
              return project.name;
            },
          ],
          ["asc"]
        );
      } else {
        this.filteredProjects = _.orderBy(
          this.filteredProjects,
          [
            function (project) {
              return project.name;
            },
          ],
          ["desc"]
        );
      }
      this.toggleSearchByName = !this.toggleSearchByName;
    },
    filterByCat(cat) {
      this.filteredProjects = [];

      if (this.selectedCats.indexOf(cat) === -1) {
        this.selectedCats.push(cat);
      } else {
        // ricorda che quando applichi approcci funzionali e sempre meglio creare una copia della prop
        // ci fai tutte le operazioni che devi e poi la riassegni alla fine
        var temp = this.selectedCats.filter((n) => {
          return n !== cat;
        });
        this.selectedCats = temp;
      }

      this.projects.forEach((project) => {
        this.selectedCats.forEach((category) => {
          if (project.type.includes(category)) {
            this.filteredProjects.push(project);
          }
        });
      });
      if (this.selectedCats.length == 0) {
        this.getProjects();
      }
    },
    async getProjects() {
      db.collection("projects")
        .get()
        .then((querySnapshot) => {
          console.log(querySnapshot);
          const projects = querySnapshot.docs.map((doc) => doc.data());
          console.log(projects);
          this.projects = projects;
          // sorting projects on the base of 'in_evidence' field
          this.projects = _.orderBy(
            this.projects,
            [
              function (proj) {
                return proj.in_evidence;
              },
            ],
            ["desc"]
          );
          //mi serve per i filtri
          this.filteredProjects = this.projects;
          this.loading = false;
        })
        .catch((error) => {
          this.errors = error.response && error.response.data.errors;
        });
    },
  },
};
</script>
<style lang="scss">
.orderBy {
  cursor: pointer;
}
.filters {
  width: 80%;
  height: 70px;
  background: rgb(73, 84, 90);
  border-radius: 10px;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}
.projectsGallery {
  width: 100%;
  min-height: 500px;
  padding: 30px;

  .projectCard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    cursor: pointer;
    margin: 20px;

    width: 80%;
    height: 100px;
    padding: 20px;
    transition: 0.5s;

    &:hover {
      background: rgb(195, 195, 195);
      transition: 0.5s;
    }

    .projCardDx {
      width: 70%;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .projDescription {
    font-size: 13px;
    font-weight: bold;
  }
  .projectImage {
    max-height: 100%;
    margin: 0 30px;
  }
  .imgPlaceholder {
    max-height: 100%;
    width: 100px;
    margin: 0 30px;
  }
  .projectTitle {
    width: 30%;
    text-align: center;
    h1 {
      font-size: 25px;
    }
    margin-right: 20px;
  }
}
</style>
