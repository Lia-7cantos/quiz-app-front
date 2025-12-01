import axios from 'axios'

// configurar axios com a URL do backend
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// interceptor para tratamento global de erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // token expirado ou inválido - fazer logout automático
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('current_quiz_attempt')
            window.location.href = '/'
        }
        return Promise.reject(error)
    }
)

// serviços de autenticação
export const authService = {
    login: (credentials) => api.post('/login', credentials),
    register: (userData) => api.post('/register', userData),
    logout: () => api.post('/logout'), // ← AGORA CHAMA A API
    getProfile: () => api.get('/user')
}

// serviços do quiz
export const quizService = {
    getRanking: () => api.get('/ranking'),
    startQuiz: () => api.post('/quiz/start'),
    getQuestions: () => api.get('/quiz/questions'),
    submitAnswer: (data) => api.post('/quiz/answer', data),
    completeQuiz: (data) => api.post('/quiz/complete', data),
    getUserAttempts: () => api.get('/quiz/attempts'),
    getResults: (attemptId) => api.get(`/quiz/results/${attemptId}`),
    resetCurrentAttempts: () => api.post('/quiz/reset-current')
}

export default api