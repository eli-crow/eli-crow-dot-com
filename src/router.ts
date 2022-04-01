import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: () => import('./routes/home.vue') },
        { path: '/ute', component: () => import('./routes/ute.vue') },
        { path: '/bead', component: () => import('./routes/bead/bead.vue') },
        { path: '/ouija', component: () => import('./routes/ouija/ouija.vue') },
        { path: '/losing-sleep', component: () => import('./routes/losing-sleep.vue') },
        { path: '/guerilla-quiz-results', component: () => import('./routes/guerilla-quiz-results/guerilla-quiz-results.vue') },
    ]
})

export default router;