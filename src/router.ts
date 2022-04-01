import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Home', component: () => import('./routes/home.vue') },
        { path: '/ute', name: 'Ute', component: () => import('./routes/ute.vue') },
        { path: '/bead', name: 'Bead Maze', component: () => import('./routes/bead/bead.vue') },
        { path: '/ouija', name: 'Ouija', component: () => import('./routes/ouija/ouija.vue') },
        { path: '/losing-sleep', name: 'Losing Sleep', component: () => import('./routes/losing-sleep.vue') },
        { path: '/guerilla-quiz-results', name: 'Quiz Results', component: () => import('./routes/guerilla-quiz-results/guerilla-quiz-results.vue') },
    ]
})

router.afterEach((to, from) => {
    //@ts-ignore
    gtag('event', 'page_view', {
        page_title: to.name,
        page_location: to.fullPath,
        page_path: to.path,
        page_referrer: from.fullPath,
    })
})

export default router;