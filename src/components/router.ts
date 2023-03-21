import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HelloWordle from "./HelloWordle.vue";
import Login from "./login.vue";
import Register from "./register.vue";
import Statistics from "./statistics.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: HelloWordle,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/statistics',
        name: 'Statistics',
        component: Statistics,
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;