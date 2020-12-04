<template>
  <div class="mHomeBox">
    <img
      class="mImgBackground"
      src="https://firebasestorage.googleapis.com/v0/b/portfolio-f8a45.appspot.com/o/twine%2Fa8NRfKPWooRVeuDSH2sVdJHzHOh2%2Ft3.jpg?alt=media&token=7d6741fe-e00f-4d61-a183-db68be2bd822"
      alt=""
    />
    <div class="mImgBackgroundOverlay"></div>
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

    <div v-if="splash" class="splash pulsate-fwd">METAMORPHOSI</div>
    <div v-if="!splash" class="mHome">
      <div class="mTop">
        <div class="mTopEl mCont">
          <div class="mLine"></div>
          <div class="mContText">CONTACTS</div>
        </div>
        <div class="mTopEl mLogo">中文</div>
        <div class="mTopEl mMenu">
          <div class="mMenuText">MENU</div>
          <div class="mLineMenu">
            <div class="mLineMenuCenterLine"></div>
          </div>
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
      }, 3);
    },
  },
};
</script>
<style lang="scss">
.mHomeBox {
  background: rgb(80, 80, 80);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  z-index: 8000;
}
.mImgBackground {
  position: absolute;
  top: 0px;
  height: 100vh;
  z-index: 8000;
}
.mImgBackgroundOverlay {
  position: absolute;
  top: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 8100;
  background: rgba(155, 155, 155, 0.589);
}
.mTripartition {
  position: absolute;
  top: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
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
    font-size: 35px;
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .mLineSx {
    margin-right: 30px;
  }
  .mLineDx {
    margin-left: 30px;
  }
  .mTripTextSx {
    justify-content: flex-start;
  }
  .mTripTextDx {
    justify-content: flex-end;
  }
  .mTripTextCenter {
    padding-bottom: 60px;
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
    border-right: 2px solid white;
  }
  .m2 {
    width: 33%;
    height: 100%;
    border-right: 2px solid white;
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
  z-index: 9998;
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
  }
  .mCont {
    justify-content: flex-start;
    cursor: pointer;
    font-weight: bold;
    color: white;
    .mContText {
      margin-left: 10px;
    }
  }
  .mMenu {
    justify-content: flex-end;
    color: white;
    font-weight: bold;
    cursor: pointer;

    .mMenuText {
      margin-right: 10px;
    }
  }
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