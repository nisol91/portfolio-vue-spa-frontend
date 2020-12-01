<template>
  <div class="p-4 d-flex flex-column">
    <div v-if="project.disabled">coming soon</div>
    <div v-if="loading" class="splash-box">
      <v-progress-circular
        :size="70"
        color="blue-grey darken-3"
        indeterminate
        class="splash-box-progress"
      ></v-progress-circular>
    </div>
    <div v-if="!project.disabled && !loading">
      <router-link
        class="backBtn d-flex justify-content-center align-items-center"
        :to="{ name: 'projects' }"
        ><i class="fas fa-arrow-left"></i> <span>back to projects</span>
      </router-link>
      <div class="titleProjBar d-flex flex-row">
        <h3 class="projText">
          Title: <span class="projTextBold">{{ project.name }}</span>
        </h3>
      </div>
      <div>
        <h4 class="projText">
          Description:
          <span class="projTextBold">{{ project.description }}</span>
        </h4>
        <h6 class="projText">
          Technologies:
          <span class="projTextBold">{{ project.type }}</span>
        </h6>

        <a
          class="routerInsideVButton linkProjBtn d-flex justify-content-center align-items-center"
          :href="project.url"
          ><v-btn
            v-if="project.url && !project.type.includes('interactive')"
            color="primary"
            rounded
            dark
            >links</v-btn
          ></a
        >

        <router-link
          class="linkProjBtn d-flex justify-content-center align-items-center"
          :to="{ name: project.url }"
          ><v-btn
            v-if="
              project.url &&
              project.type &&
              project.type.includes('interactive')
            "
            color="primary"
            rounded
            dark
            >to the interactive project</v-btn
          ></router-link
        >
      </div>

      <div class="mediaProj d-flex flex-row align-items-start">
        <div class="mediaSx">
          <h4 v-if="$i18n.locale == 'en'">
            {{ project.long_description }}
          </h4>
          <h4 v-if="$i18n.locale == 'it'">
            {{ project.long_description_ita }}
          </h4>
        </div>
        <div
          class="mediaDx d-flex flex-column justify-content-center align-items-center"
        >
          <!-- IMPORTANTE-------METTI SEMPRE IL / ALL INIZIO DEI PERCORSI -->
          <img
            v-for="image in project.img"
            :key="image"
            class="projectImage2"
            :src="image"
            alt=""
          />
          <video v-if="project.video" controls class="projVideo">
            <source :src="project.video" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { db } from "../../main";

export default {
  data() {
    return {
      id: this.$route.params.id,
      project: {},
      loading: true,
    };
  },
  created() {
    this.$store.commit("toggleHomePage", false);

    this.getProject();
  },
  methods: {
    async getProject() {
      db.collection("projects")
        .where("id", "==", this.id)
        .get()
        .then((querySnapshot) => {
          const project = querySnapshot.docs.map((doc) => doc.data());
          // console.log(project[0]);
          this.project = project[0];
          this.loading = false;
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    },
  },
};
</script>
<style lang="scss">
.linkProjBtn {
  //   width: 200px;
}
.mediaSx {
  width: 100%;
  padding-right: 10px;
  border-right: 2px solid rgba(81, 86, 95, 0.616);
}
.mediaDx {
  width: 100%;
}
.projectImage2 {
  margin: 100px 10px;
  width: 40%;
  &:hover {
  }
}
.projText {
  margin: 30px 0px;
}
.projTextBold {
  font-weight: bold;
}
.projVideo {
  margin: 20px 10px;
  max-width: 100vw;
}
.mediaProj {
  border-top: 1px solid rgba(60, 69, 85, 0.616);
  margin: 30px 0px;
  padding: 30px 0px;
  flex-wrap: wrap !important;
}
.backBtn {
  width: 200px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid grey;
  &:hover {
    background: grey;
    transition: 0.5s;
    text-decoration: none;
  }
  i {
    margin-right: 10px;
  }
}
</style>
