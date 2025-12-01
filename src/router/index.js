import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/pages/Login.vue')
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue')
    },
    {
        path: '/quiz',
        name: 'Quiz',
        component: () => import('@/pages/Quiz.vue')
    },
    {
        path: '/results/:attemptId',
        name: 'Results',
        component: () => import('@/pages/Results.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router