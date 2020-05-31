import Vue from "vue";
import Router from "vue-router";
import LivresList from "./components/LivresList.vue";
import LecteursList from "./components/LecteursList.vue";
import PretsList from './components/PretsList.vue'




Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/livres",
            name: "livres",
            component: LivresList,
        },
        {
            path: "/lecteurs",
            name: "lecteurs",
            component: LecteursList,
        },
        {
            path: "/prets",
            name: "prets",
            component: PretsList,
        }
    ]
});