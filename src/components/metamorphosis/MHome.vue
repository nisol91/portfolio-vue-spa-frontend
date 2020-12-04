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
        <div class="mTrip m1">
          <div class="mTripText mTripTextSx">
            <div class="mLine mLineSx"></div>
            ABOUT
          </div>
        </div>
        <div class="mTrip mTripCenter m2">
          <div class="mTripText mTripTextCenter">CONTENTS</div>
          <div class="mLineBottom"></div>
        </div>

        <div class="mTrip m3">
          <div class="mTripText mTripTextDx">
            BLOG
            <div class="mLine mLineDx"></div>
          </div>
        </div>
      </div>

      <div class="mTop">
        <div class="mTopEl mCont">
          <div class="mLine"></div>
          <div class="mContText">CONTACTS</div>
        </div>
        <div class="mTopEl mLogo">中文</div>
        <div class="mTopEl mMenu">
          <div class="menuOpen" :class="[{ showMenu: menu }]">
            <div class="menuEl">HOME</div>
            <div>/</div>
            <div class="menuEl">ABOUT</div>
            <div>/</div>
            <div class="menuEl">CONTENT</div>
            <div>/</div>
            <div class="menuEl">SHOP</div>
            <div>/</div>
            <div class="menuEl">CONTACTS</div>
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
      splash: true,
      menu: false,
    };
  },
  created() {
    this.$store.commit("isMetamorphosis", true);
    this.setSplash();
  },
  methods: {
    setSplash() {
      setTimeout(() => {
        this.splash = false;
      }, 0);
    },
    toggleMenu() {
      this.menu = !this.menu;
    },
  },
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

  &:hover {
    text-decoration: line-through;
    transition: 2s;
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
  z-index: 9997;
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
  right: 50px;
}
.menuCross {
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
</style>