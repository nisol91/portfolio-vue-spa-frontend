
// import Bookables from "./components/bookables/Bookables";
// import Bookable from "./components/bookable/Bookable";
// import ToccaVinoHome from "./components/toccavino/ToccaVinoHome";
// import ToccaVinoAddEvent from "./components/toccavino/ToccaVinoAddEvent";
// import ToccaVinoPayment from "./components/toccavino/ToccaVinoPayment";
// import VerifyEmail from "./components/auth/VerifyEmail";
// import ForgotPassword from "./components/auth/ForgotPassword";
// import ResetPassword from "./components/auth/ResetPassword";
// import AdminDashboard from "./components/admin/AdminDashboard";
import Register from "./components/auth/Register.vue";
import Login from "./components/auth/Login.vue";
import UserProfile from "./components/user/UserProfile";
import Projects from "./components/portfolio/Projects";
import SingleProject from "./components/portfolio/SingleProject";
import Portfolio from "./components/portfolio/Portfolio";
import ForgotPassword from "./components/auth/ForgotPassword";

// import App from "./App.vue";
// import Review from "./components/review/Review";
// import Basket from "./components/basket/Basket";
// import NotFound from "./components/shared/components/NotFound";


import VueRouter from "vue-router";
import firebase from 'firebase'

const routes = [
    {
        path: "/",
        component: Portfolio,
        name: "home"
    },

    {
        path: "/projects",
        component: Projects,
        name: "projects"
    },
    {
        path: "/project/:id",
        component: SingleProject,
        name: "project"
    },
    {
        path: "/auth/login",
        component: Login,
        name: "login"
    },
    {
        path: "/auth/register",
        component: Register,
        name: "register"
    },
    {
        path: "/auth/forgot-password",
        name: "forgotPassword",
        component: ForgotPassword,
        beforeEnter(to, from, next) {
            const user = firebase.auth().currentUser;
            if (user) {
                next({ name: "home" });
            } else {
                next();
            }
        },
    },
    {
        path: "/userProfile",
        component: UserProfile,
        name: "userProfile"
    },
    // // un altro modo alternativo per importare un componente vue
    // {
    //     path: "/auth/login",
    //     component: require('./components/auth/Login.vue').default,
    //     name: "login"
    // },
    // {
    //     path: "/laravelBnB",
    //     component: Bookables,
    //     name: "laravelBnB"
    // },
    // {
    //     path: "/adminDashboard",
    //     component: AdminDashboard,
    //     name: "adminDashboard"
    // },
    // {
    //     path: "/verify-email",
    //     component: VerifyEmail,
    //     name: "verifyEmail"
    // },
    // {
    //     path: "/forgot-password",
    //     component: ForgotPassword,
    //     name: "forgotPassword"
    // },
    // {
    //     path: "/reset-password",
    //     component: ResetPassword,
    //     name: "resetPassword"
    // },
    // {
    //     path: "/bookable/:id",
    //     component: Bookable,
    //     name: "bookable"
    // },
    // {
    //     path: "/reviews/:id",
    //     component: Review,
    //     name: "review"
    // },
    // {
    //     path: "/basket",
    //     component: Basket,
    //     name: "basket"
    // },
    // {
    //     path: "/tocca-vino",
    //     component: ToccaVinoHome,
    //     name: "toccaVinoHome"
    // },
    // {
    //     path: "/add-wine-event",
    //     component: ToccaVinoAddEvent,
    //     name: "toccaVinoAddEvent"
    // },
    // {
    //     path: "/support-us",
    //     component: ToccaVinoPayment,
    //     name: "toccaVinoPayment"
    // },
    // { path: '*', component: NotFound }

]

const router = new VueRouter({
    mode: 'history',
    routes,
})

export default router;
