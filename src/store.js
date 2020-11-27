import { isLoggedIn, logOut } from "./components/shared/utils/auth"
import axios from 'axios'
import firebase from "firebase";
import { db, Timestamp, GeoPoint } from "./main";
import router from "./routes";


export default {
    // vuex store
    state: {
        isHomePage: true,
        lastSearch: {
            from: null,
            to: null,
        },
        basket: {
            items: []
        },
        isLoggedIn: false,
        isEmailVerified: true,
        userRole: "",
        user: {},
        globalMessage: ''
    },
    // le mutations hanno solo il compito di mutare lo stato dell'app, sono
    // come semplici funzioni
    mutations: {
        setLastSearch(state, payload) {
            state.lastSearch = payload
        },
        addToBasket(state, payload) {
            state.basket.items.push(payload)
        },
        removeFromBasket(state, payload) {
            // col filter tengo solo gli elementi che rispettano la condizione, cioè tutti
            // quelli che hann un id differente da quello che passo alla mutation
            state.basket.items = state.basket.items.filter(item => item.bookable.id != payload)
        },
        setBasket(state, payload) {
            state.basket = payload
        },
        setGlobalMessage(state, payload) {
            state.globalMessage = payload

        },
        setUser(state, payload) {
            state.user = payload
        },
        getUserOnRefresh(state) {
            if (localStorage.getItem("isLoggedIn") === "true") {
                state.user = JSON.parse(localStorage.getItem("currentUser"));
            }
        },
        setLoggedIn(state) {
            state.isLoggedIn = true
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('currentUser', JSON.stringify(state.user))
        },
        setLoggedOut(state) {
            state.isLoggedIn = false
            localStorage.setItem('isLoggedIn', false);
            localStorage.setItem('currentUser', '')
        },
        setEmailVerified(state, payload) {
            state.isEmailVerified = payload
        },
        setUserRole(state, payload) {
            state.userRole = payload

        },
        toggleHomePage(state, payload) {
            state.isHomePage = payload
        }
    },
    // le actions mi chiamano le mutations e in più salvano nel local storage
    // di modo che anche al refresh i dati rimangano salvati
    actions: {
        // questo metodo mi va a caricare i dati salvati in sessione, viene chiamato
        // in app.js alla creazione dell'app
        loadStoredState(context) {
            // last search
            const lastSearch = localStorage.getItem('lastSearch')
            if (lastSearch) {
                context.commit('setLastSearch', JSON.parse(lastSearch));
            }
            // basket
            const basket = localStorage.getItem('basket')
            if (basket) {
                context.commit('setBasket', JSON.parse(basket));
            }

            // questo mi va a fixare il delay causato dall' action async loadUser
            // quindi appena mi si apre l app carico subito il valore del loggedin
            // nello stored state, cosa che e immediata e non asincrona
            context.commit('setLoggedIn', isLoggedIn())
        },
        setLastSearch(context, payload) {
            context.commit('setLastSearch', payload);
            localStorage.setItem('lastSearch', JSON.stringify(payload))
        },
        addToBasket(context, payload) {
            context.commit('addToBasket', payload);
            localStorage.setItem('basket', JSON.stringify(context.state.basket))
        },
        removeFromBasket(context, payload) {
            context.commit('removeFromBasket', payload);
            localStorage.setItem('basket', JSON.stringify(context.state.basket))
        },
        // {commit, state} è il deconstructed object di context (è la stessa cosa, soloche posso
        // accedere direttamente a quei valori, avendo decostruito l'oggetto passato alla action)
        clearBasket({ commit, state }, payload) {
            commit('setBasket', { items: [] });
            localStorage.setItem('basket', JSON.stringify(state.basket))
        },
        // it loads the user and the auth state in the state
        async loadUser({ commit, dispatch }, payload) {
            if (isLoggedIn()) {
                try {
                    //se auth va a buon fine allora prendo utente
                    const user = (await axios.get('/api/user')).data

                    //  ma prima verifico che la mail sia verificata
                    if (user.user_data.email_verified_at != null) {

                        commit('setUser', user.user_data)

                        // questo avviene quando tutto va a buon fine, e se ricarico la pagina,
                        // isLoggedIn() va a verificare che l utente sia gia loggato
                        commit('setLoggedIn', true)
                        commit('setEmailVerified', true);

                    } else {
                        dispatch('logout')
                        // se la mail non e verificata
                        commit('setEmailVerified', false);

                    }
                } catch (error) {
                    // se ho errore allora logout
                    dispatch('logout')
                }
            }
        },
        async getUserRole({ commit }) {
            const role = (await axios.get("/api/get-user-role")).data.role;
            //  console.log("RUOLO vuex " + role)
            commit('setUserRole', role)
        },
        async logout({ commit, dispatch }) {
            // laravel endpoint
            await axios.post("/api/logout");
            // commit 2 actions
            commit('setUser', {})
            commit('setLoggedIn', false)
            // rimuove logged in dal local storage
            logOut()
            // rimuovo il ruolo per sicurezza
            commit('setUserRole', "")
            // azzero token
            localStorage.setItem("token", "");

        },
        async verifyEmail({ dispatch }, payload) {
            try {
                //  console.log(payload)
                await axios
                    .get('/api/email-verification', {
                        params: payload
                    })
            } catch (error) {
                dispatch('logout')
            }
        },

        // firebase
        signOut({ commit, dispatch }) {
            firebase
                .auth()
                .signOut()
                .then(() => {
                    commit('setLoggedOut')
                    commit('setUser', {})
                    if (router.currentRoute.name !== 'home') {
                        router.replace({
                            name: "home"
                        });
                    }
                });
        },
        registration({ commit, dispatch }, payload) {

            const err = firebase
                .auth()
                .createUserWithEmailAndPassword(payload.email, payload.password)
                .then((data) => {
                    console.log(data)
                    db.collection("users")
                        .doc(data.user.uid)
                        .set({ displayName: payload.name, email: payload.email });
                })
                .then(() => {
                    // now we have access to the signed in user
                    const user = firebase.auth().currentUser;
                    user.updateProfile({ displayName: payload.name });
                    // send the signed in user a verification email
                    // const actionCodeSettings = {
                    //     url: `https://${window.location.hostname}/auth/login`,
                    // };
                    user.sendEmailVerification();
                    commit('setGlobalMessage', 'successfully registered: check your email address')
                    setTimeout(() => {
                        commit('setGlobalMessage', '')
                    }, 3000)
                    dispatch('signOut')
                    router.replace({
                        name: "home"
                    });
                })
                .catch((err) => {
                    // console.log(err.message)
                    return err
                });
            return err
        },
        login({ commit, dispatch }, payload) {
            const err = firebase
                .auth()
                .signInWithEmailAndPassword(payload.email, payload.password)
                .then((data) => {
                    if (!firebase.auth().currentUser.emailVerified) {
                        dispatch("signOut");
                        return
                    }
                    const user = firebase.auth().currentUser


                    // se non ho ancora creato l user nel db, lo creo al primo login
                    if (!db.collection("users")
                        .doc(user.uid)) {
                        db.collection("users")
                            .doc(user.uid)
                            .set({ displayName: user.displayName, email: user.email });
                    }

                    commit('setUser', {
                        displayName: firebase.auth().currentUser.displayName,
                        email: firebase.auth().currentUser.email,
                    })
                    commit('setLoggedIn')

                    router.replace({ name: "home" });
                    commit('setGlobalMessage', 'successfully logged in')
                    setTimeout(() => {
                        commit('setGlobalMessage', '')
                    }, 3000)
                })
                .catch((err) => {
                    return err
                });
            return err

        },
        loadFirebaseUserAfterRefresh({ commit, dispatch }) {

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    commit('setLoggedIn')
                    // console.log(user)

                } else {
                    commit('setLoggedOut')

                }
            });
        },
        forgotPassword({ commit, dispatch }, payload) {
            if (!payload) {
                return "Please type in a valid email address.";
            }
            firebase
                .auth()
                .sendPasswordResetEmail(payload)
                .then(() => {
                    return true;
                })
                .catch(error => {
                    return error.message;
                });
        },
        closeGlobalSnackbar({ commit, dispatch }) {
            commit('setGlobalMessage', false)
        },
        async saveEvent({ commit, dispatch }, payload) {
            console.log(payload)
            return db.collection('wineEvents').add({
                userId: firebase.auth().currentUser.uid,
                createdTimestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                name: payload.name,
                description: payload.description,
                city: payload.city,
                address: payload.address,
                price: payload.price,
                media: payload.media,
                date: payload.date,
                // date: Timestamp.fromDate(new Date(payload.date)),
                location: new GeoPoint(payload.location.latitude, payload.location.longitude),

            }).then(() => commit('setGlobalMessage', 'successfully created new event'))
        },
        async saveCellar({ commit, dispatch }, payload) {
            console.log(payload)
            return db.collection('cellars').add({
                userId: firebase.auth().currentUser.uid,
                createdTimestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                isCellar: true,
                cellarType: payload.selectedCellarType,
                name: payload.name,
                description: payload.description,
                city: payload.city,
                address: payload.address,
                media: payload.media,
                location: new GeoPoint(payload.location.latitude, payload.location.longitude),
            }).then(() => commit('setGlobalMessage', 'successfully created new cellar'))
        },


        async updateEvent({ commit, dispatch }, payload) {
            console.log(payload)
            return db.collection('wineEvents').doc(payload.id).update({
                userId: firebase.auth().currentUser.uid,
                updatedTimestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                name: payload.name,
                description: payload.description,
                city: payload.city,
                address: payload.address,
                price: payload.price,
                media: payload.media,
                date: payload.date,
                // date: Timestamp.fromDate(new Date(payload.date)),
                location: new GeoPoint(payload.location.latitude, payload.location.longitude),

            }).then(() => commit('setGlobalMessage', 'successfully updated new event'))
        },
        async updateCellar({ commit, dispatch }, payload) {
            console.log(payload)
            return db.collection('cellars').doc(payload.id).update({
                userId: firebase.auth().currentUser.uid,
                updatedTimestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                isCellar: true,
                cellarType: payload.selectedCellarType,
                name: payload.name,
                description: payload.description,
                city: payload.city,
                address: payload.address,
                media: payload.media,
                location: new GeoPoint(payload.location.latitude, payload.location.longitude),
            }).then(() => commit('setGlobalMessage', 'successfully updated new cellar'))
        },

    },
    // sono come le computed properties del componente vue
    getters: {
        itemsInBasket: (state) => state.basket.items.length,

        // higher horder function: is a functions composition, this means that is a function
        // that returns another function
        // Questa funzione controlla che l'elemento sia già o meno nel basket
        // con un reduce(function abbastanza complicata)
        inBasketAlready(state) {
            // returns Boolean
            return function (id) {
                return state.basket.items.reduce((result, item) => result || item.bookable.id === id, false)
            }
        }
    }
}
