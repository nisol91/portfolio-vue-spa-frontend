<template>
  <div class="mHomeBox">
    <div v-if="splash" class="splash pulsate-fwd">METAMORPHOSI</div>
    <div v-if="!splash" class="mHome">
      <!-- <img
        class="mImgBackground"
        src="https://firebasestorage.googleapis.com/v0/b/portfolio-f8a45.appspot.com/o/home_1.jpg?alt=media&token=3cac5c30-12cc-47cb-ae90-0de367b74369"
        alt=""
      /> -->
      <div class="mImgBackgroundOverlay"></div>
      <div v-if="menu" class="mBackgroundOverlay fade-in fade-out"></div>

      <div class="mTripartition">
        <div
          class="mTrip m1 mTripSx"
          :class="[
            {
              mTripSxHover: mTripSxHover,
              mTripHidden: mTripDxHover,
              mShort: mTripDxHover,
            },
          ]"
          :style="{
            backgroundImage: `url(${mTripSxHover ? img : ''})`,
            backgroundSize: `cover`,
          }"
        >
          <div
            class="mTripText mTripTextSx"
            @mouseenter="mTripSxHover = true"
            @mouseleave="mTripSxHover = false"
          >
            <div class="mLine mLineSx"></div>
            ABOUT
          </div>
        </div>
        <div
          class="mTrip mTripCenter m2"
          :class="[
            {
              mTripCenterHover: mTripCenterHover,
              mTripCenterHidden: mTripDxHover,
              mTripCenterHidden_2: mTripSxHover,
            },
          ]"
        >
          <div
            class="mTripText mTripTextCenter"
            @mouseenter="mTripCenterHover = true"
            @mouseleave="mTripCenterHover = false"
          >
            CONTENTS
          </div>
          <div class="mLineBottom"></div>
        </div>

        <div
          class="mTrip m3 mTripDx"
          :class="[
            {
              mTripDxHover: mTripDxHover,
              mTripHidden: mTripSxHover,
              mShort: mTripSxHover,
            },
          ]"
          :style="{
            backgroundImage: `url(${mTripDxHover ? img : ''})`,
            backgroundSize: `cover`,
          }"
        >
          <div
            class="mTripText mTripTextDx"
            @mouseenter="mTripDxHover = true"
            @mouseleave="mTripDxHover = false"
          >
            BLOG
            <div class="mLine mLineDx"></div>
          </div>
        </div>
      </div>

      <!-- mobile tripartition -->

      <div class="mTripartitionMobile">
        <div class="mTripMobile">ABOUT</div>
        <div class="mTripMobile">CONTENTS</div>
        <div class="mTripMobile">BLOG</div>
      </div>

      <!-- header bar -->

      <div class="mTop">
        <div class="mTopEl mCont">
          <div class="mLine"></div>
          <div class="mContText">CONTACTS</div>
        </div>
        <div class="mTopEl mLogo">中文</div>
        <div class="mTopEl mMenu">
          <div class="menuOpen" :class="[{ showMenu: menu }]">
            <div class="menuEl" @click="selectEl('home')">
              <div
                class="menuLine"
                :class="[{ menuLineShow: menuEl.home.val }]"
              ></div>
              HOME
            </div>
            <div class="menuElDivider">/</div>
            <div class="menuEl" @click="selectEl('about')">
              <div
                class="menuLine"
                :class="[{ menuLineShow: menuEl.about.val }]"
              ></div>
              ABOUT
            </div>
            <div class="menuElDivider">/</div>
            <div class="menuEl" @click="selectEl('content')">
              <div
                class="menuLine"
                :class="[{ menuLineShow: menuEl.content.val }]"
              ></div>
              CONTENT
            </div>
            <div class="menuElDivider">/</div>
            <div class="menuEl" @click="selectEl('blog')">
              <div
                class="menuLine"
                :class="[{ menuLineShow: menuEl.blog.val }]"
              ></div>
              BLOG
            </div>
            <div class="menuElDivider">/</div>
            <div class="menuEl" @click="selectEl('shop')">
              <div
                class="menuLine"
                :class="[{ menuLineShow: menuEl.shop.val }]"
              ></div>
              SHOP
            </div>
            <div class="menuElDivider">/</div>
            <div class="menuEl" @click="selectEl('contacts')">
              <div
                class="menuLine"
                :class="[{ menuLineShow: menuEl.contacts.val }]"
              ></div>
              CONTACTS
            </div>
          </div>
          <div class="mMenuText fade-in fade-out" :class="[{ hideMenu: menu }]">
            MENU
          </div>

          <div
            v-if="!menu"
            class="mLineMenu fade-in fade-out"
            @click="toggleMenu"
          >
            <div class="mLineMenuCenterLine"></div>
          </div>
          <v-icon
            v-if="menu"
            @click="toggleMenu"
            class="menuCross fade-in fade-out"
            >mdi-close</v-icon
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuEl: {
        home: {
          val: true,
          slug: "home",
        },
        about: {
          val: false,
          slug: "about",
        },
        content: {
          val: false,
          slug: "content",
        },
        blog: {
          val: false,
          slug: "blog",
        },
        shop: {
          val: false,
          slug: "shop",
        },
        contacts: {
          val: false,
          slug: "contacts",
        },
      },
      splash: true,
      menu: false,
      mTripCenterHover: false,
      mTripDxHover: false,
      mTripSxHover: false,
      backgrounds: [
        "https://firebasestorage.googleapis.com/v0/b/portfolio-f8a45.appspot.com/o/twine%2F4k-desktop-wallpaper.-2560%C3%971080.jpg?alt=media&token=1ad3dc60-d128-48cd-8d1d-894fd3156abc",
        "https://firebasestorage.googleapis.com/v0/b/portfolio-f8a45.appspot.com/o/twine%2F4k-wallpaper-clouds-cloudy-1183099.jpg?alt=media&token=02117b89-7751-4feb-9fe0-a6be5ceb488c",
      ],
      img: null,
    };
  },
  created() {
    this.$store.commit("isMetamorphosis", true);
    this.setSplash();
    this.backImgs();
  },
  methods: {
    selectEl(value) {
      var menu = this.menuEl;
      for (const el in menu) {
        if (menu[el].slug != value) {
          menu[el].val = false;
        } else {
          menu[el].val = true;
        }
      }
    },
    setSplash() {
      setTimeout(() => {
        this.splash = false;
      }, 0);
    },
    toggleMenu() {
      this.menu = !this.menu;
    },
    backImgs() {
      setInterval(() => {
        this.img = this.backgrounds[
          Math.floor(Math.random() * this.backgrounds.length)
        ];
      }, 1000);
    },
  },
  computed: {},
};
</script>
<style lang="scss">
.fade-out {
  -webkit-animation: fade-out 1s ease-out both;
  animation: fade-out 1s ease-out both;
}
.fade-in {
  -webkit-animation: fade-in 1.2s cubic-bezier(0.39, 0.575, 0.565, 1) both;
  animation: fade-in 1.2s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}
.mHomeBox {
  background: rgb(80, 80, 80);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  z-index: 8000;
  background-image: url("https://firebasestorage.googleapis.com/v0/b/portfolio-f8a45.appspot.com/o/home_1.jpg?alt=media&token=3cac5c30-12cc-47cb-ae90-0de367b74369");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}
// .mImgBackground {
//   position: absolute;
//   top: 0px;
//   height: 110vh;
//   z-index: 8000;
// }
.mImgBackgroundOverlay {
  position: absolute;
  top: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 8100;
  background: rgba(155, 155, 155, 0.589);
}
.mBackgroundOverlay {
  position: absolute;
  top: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 9997;
  background: rgba(22, 22, 22, 0.589);
}
.menuEl {
  transition: 2s;
  margin: 0 10px;
  position: relative;

  &:hover {
    // text-decoration: line-through;
    transition: 2s;
    .menuLine {
      opacity: 1;
      transition: 0.5s;
    }
  }

  .menuLine {
    position: absolute;
    top: 10px;
    opacity: 0;
    transition: 0.5s;
    width: 100%;
    height: 1px;
    background: white;
  }
  .menuLineShow {
    opacity: 1;
    transition: 0.5s;
  }
}
.mTripartition {
  position: absolute;
  top: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 9996;
  display: flex;
  justify-content: center;
  align-items: center;
  .mTrip {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 100px;
  }
  .mTripCenter {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 0px;
    flex-direction: column;
    transition: 1s;
  }
  .mTripSx {
    transition: 1s;
  }
  .mTripDx {
    transition: 1s;
  }
  .mTripCenterHover {
    background: white;
    transition: 1s;
    width: 60vw !important;
  }
  .mTripCenterHidden,
  .mTripCenterHidden_2 {
    background: rgba(61, 61, 61, 0.897);
  }
  .mTripHidden {
    background: rgba(0, 0, 0, 0.89);
  }
  .mTripDxHover,
  .mTripSxHover {
    background: rgba(128, 128, 128, 0.404);
    transition: 1s;
    width: 55vw !important;
  }
  .mTripText {
    color: white;
    font-weight: bold;
    font-size: 45px;
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 9995;
  }
  .mLineSx {
    margin-right: 30px;
    transition: 1s;
  }
  .mLineDx {
    margin-left: 30px;
    transition: 1s;
  }
  .mTripTextSx {
    justify-content: flex-start;
    transition: 2s;
    &:hover {
      .mLineSx {
        width: 300px;
        transition: 2s;
      }
    }
  }
  .mTripTextDx {
    justify-content: flex-end;
    transition: 2s;

    &:hover {
      .mLineDx {
        width: 300px;
        transition: 2s;
      }
    }
  }

  .mTripTextCenter {
    padding-bottom: 60px;
    transition: 2s;
    &:hover {
      color: black;
      transition: 2s;
    }
  }
  .mLineBottom {
    width: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    border-left: 0.5px solid white;
    border-right: 0.5px solid white;
  }
  .m1 {
    width: 33%;
    height: 100%;
    border-right: 0.3px solid rgba(255, 255, 255, 0.507);
  }

  .m2 {
    width: 33%;
    height: 100%;
    border-right: 0.3px solid rgba(255, 255, 255, 0.507);
  }

  .m3 {
    width: 33%;
    height: 100%;
  }
  .mShort {
    width: 28%;
  }
}
.mHome {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  z-index: 9996;
}
.mTop {
  width: 100vw;
  height: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .mTopEl {
    width: 33%;
    display: flex;
    align-items: center;
  }
  .mLogo {
    justify-content: center;
    color: red;
    font-weight: bold;
    font-size: 30px;
    cursor: pointer;
    z-index: 9994;
  }
  .mCont {
    justify-content: flex-start;
    cursor: pointer;
    font-weight: bold;
    color: white;
    z-index: 9999;
    .mContText {
      margin-left: 10px;
    }
  }
  .mMenu {
    justify-content: flex-end;
    z-index: 9999;
    color: white;
    font-weight: bold;
    cursor: pointer;

    .mMenuText {
      margin-right: 10px;
    }
    .hideMenu {
      display: none;
    }
  }
}

.menuOpen {
  position: fixed;
  top: 40px;
  right: -300px;
  transition: 0.5s;
  display: flex;
  justify-content: space-between;
  width: 300px;
}
.showMenu {
  transition: 0.5s;
  right: 250px;
}
.menuCross {
  margin-right: 10px;
  font-size: 40px !important;
  color: white !important;
}
.mLine {
  width: 50px;
  height: 1px;
  border-bottom: 2px solid white;
}
.mLineMenu {
  width: 50px;
  height: 20px;
  border-top: 2px solid white;
  border-bottom: 2px solid white;
  position: relative;
  .mLineMenuCenterLine {
    position: absolute;
    height: 1px;
    width: 100%;
    top: 7px;
    border-bottom: 2px solid white;
  }
}
.splash {
  color: white;
  font-weight: bold;
  font-size: 30px;
}
.pulsate-fwd {
  -webkit-animation: pulsate-fwd 1.5s ease-in-out infinite both;
  animation: pulsate-fwd 1.5s ease-in-out infinite both;
}

.mTripartitionMobile {
  display: none;
  position: absolute;
  top: 100px;
  width: 100vw;
  height: calc(100vh - 100px);
  z-index: 9996;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

//  media

// ##
@media (max-width: 1050px) {
  .mTripartition {
    display: none;
  }
  .mTripartitionMobile {
    display: flex;
  }
  .mTripMobile {
    color: white;
    font-weight: bold;
    font-size: 45px;
    cursor: pointer;
    border-bottom: 0.5px solid white;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 33%;
  }
  .mTop {
    background: rgba(255, 255, 255, 0.329);
  }
}
// ##
@media (max-width: 800px) {
  .menuOpen {
    width: 300px;
    top: 80px;
  }

  .showMenu {
    transition: 0.5s;
    right: 20px;
  }
  .menuEl {
    font-size: 10px;
    margin: 0 3px;
    .menuLine {
      top: -3px;
    }
  }
  .menuElDivider {
    display: none;
  }
}
</style>