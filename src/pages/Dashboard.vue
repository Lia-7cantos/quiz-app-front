<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- header com Logout -->
    <div class="max-w-6xl mx-auto mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Bem-vindo, {{ userName }}!</p>
      </div>
      <button 
        @click="handleLogout"
        class="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Sair
      </button>
    </div>

    <div class="max-w-6xl mx-auto">
      <!-- informações do Quiz -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            Informações do Quiz
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Total de Questões</p>
            <p class="text-2xl font-bold text-blue-600">10</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Tempo Médio</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.averageTime }}s</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Pontos por Acerto</p>
            <p class="text-2xl font-bold text-purple-600">10</p>
          </div>
        </div>
      </div>

      <!-- grid principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- ranking Geral -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4"> Ranking Geral</h2>
          <div v-if="ranking.length > 0" class="space-y-3">
            <div v-for="(user, index) in ranking" :key="user.user_id" 
                 class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                 :class="user.is_current_user ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'">
              <div class="flex items-center">
                <span class="text-lg font-bold mr-3">
                  {{ index === 0 ? '1º' : index === 1 ? '2º' : index === 2 ? '3'º : `${index + 1}º` }}
                </span>
                <div>
                  <p class="font-medium flex items-center gap-2">
                    {{ user.name }}
                    <span v-if="user.is_current_user" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Você
                    </span>
                  </p>
                  <div class="text-sm text-gray-600 flex gap-2">
                    <span>Melhor: {{ user.best_score }}%</span>
                    <span>•</span>
                    <span>Média: {{ user.avg_score }}%</span>
                    <span v-if="user.total_attempts > 1">({{ user.total_attempts }})</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">{{ user.avg_score }}%</p>
                <p class="text-xs text-gray-500">{{ user.total_attempts }} tentativa{{ user.total_attempts !== 1 ? 's' : '' }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-500">Nenhum ranking disponível ainda</p>
          </div>
        </div>

        <!-- suas estatísticas -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Suas Estatísticas</h2>
          <div class="space-y-4">
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-green-100 to-blue-100 rounded-full mb-2">
                <span class="text-xl font-bold text-gray-900">{{ stats.averageScore }}%</span>
              </div>
              <p class="text-gray-600">Média de Acertos</p>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 p-3 rounded-lg text-center">
                <p class="text-lg font-bold text-gray-900">{{ stats.totalQuizzes }}</p>
                <p class="text-sm text-gray-600">Tentativas</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg text-center">
                <p class="text-lg font-bold text-green-600">{{ stats.bestScore }}%</p>
                <p class="text-sm text-gray-600">Melhor</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg text-center">
                <p class="text-lg font-bold text-blue-600">{{ stats.totalCorrect }}</p>
                <p class="text-sm text-gray-600">Acertos</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg text-center">
                <p class="text-lg font-bold text-red-600">{{ stats.totalWrong }}</p>
                <p class="text-sm text-gray-600">Erros</p>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200">
              <p class="text-sm font-medium mb-2">Seu Progresso</p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-green-600 h-2 rounded-full" 
                  :style="{ width: stats.averageScore + '%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Acertos: {{ stats.totalCorrect }} / Erros: {{ stats.totalWrong }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- tentativas do usuário -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold"> Suas Tentativas</h2>
          <span class="text-sm text-gray-600">{{ userAttempts.length }} tentativa{{ userAttempts.length !== 1 ? 's' : '' }}</span>
        </div>
        
        <div v-if="userAttempts.length > 0" class="space-y-3">
          <div 
            v-for="attempt in userAttempts" 
            :key="attempt.id" 
            @click="viewResults(attempt.id)"
            class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
          >
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">Tentativa #{{ attempt.id }}</p>
                <div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>{{ formatDate(attempt.completed_at) }}</span>
                  <span>•</span>
                  <span>{{ attempt.time_spent }}s</span>
                  <span>•</span>
                  <span>{{ attempt.correct_answers }}/10 acertos</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xl font-bold" :class="getScoreColor(attempt.score)">
                  {{ attempt.score }}%
                </p>
                <p class="text-sm text-gray-600">
                  {{ attempt.score >= 70 ? 'Bom' : attempt.score >= 50 ? ' OK' : ' Estude mais' }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-500 mb-4">Você ainda não completou nenhum quiz</p>
          <button 
            @click="startNewQuiz"
            class="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700"
          >
            Iniciar Primeiro Quiz
          </button>
        </div>
      </div>

      <!-- botões de ação -->
      <div class="flex flex-col sm:flex-row gap-4">
        <button 
          @click="startNewQuiz"
          :disabled="startingQuiz"
          class="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg v-if="startingQuiz" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ startingQuiz ? 'Iniciando...' : ' Iniciar Novo Quiz' }}
        </button>

        <button 
          @click="resetAttempts"
          class="px-4 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 flex items-center justify-center gap-2"
        >
          Resetar Tentativas
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService, quizService } from '@/services/api'

const router = useRouter()

// estados
const startingQuiz = ref(false)
const ranking = ref([])
const userAttempts = ref([])
const stats = ref({
  totalQuizzes: 0,
  averageScore: 0,
  bestScore: 0,
  averageTime: 0,
  totalCorrect: 0,
  totalWrong: 0
})

// computed para nome do usuário
const userName = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.name || 'Usuário'
})

// funções
const startNewQuiz = async () => {
  startingQuiz.value = true
  
  try {
    localStorage.removeItem('current_quiz_attempt')
    const response = await quizService.startQuiz()
    const attemptId = response.data.attempt_id
    localStorage.setItem('current_quiz_attempt', attemptId)
    router.push(`/quiz?attempt=${attemptId}`)
  } catch (error) {
    console.error('Erro ao iniciar quiz:', error)
    alert('Erro ao iniciar quiz. Tente novamente.')
  } finally {
    startingQuiz.value = false
  }
}

const resetAttempts = async () => {
  if (!confirm('Tem certeza que deseja resetar todas as tentativas pendentes?')) {
    return
  }
  
  try {
    const response = await quizService.resetCurrentAttempts()
    alert(`${response.data.message}`)
    localStorage.removeItem('current_quiz_attempt')
  } catch (error) {
    console.error('Erro no reset:', error)
    alert('Erro ao resetar tentativas')
  }
}

const loadDashboardData = async () => {
  try {
    const [rankingResponse, attemptsResponse] = await Promise.all([
      quizService.getRanking(),
      quizService.getUserAttempts()
    ])
    
    // processar ranking
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    const rankingData = rankingResponse.data.ranking || rankingResponse.data || []
    
    ranking.value = rankingData.map((user, index) => ({
      user_id: user.user_id,
      name: user.name || `Jogador ${user.user_id}`,
      best_score: user.best_score || 0,
      avg_score: user.avg_score || 0,
      total_attempts: user.total_attempts || 0,
      total_time: user.total_time || 0,
      is_current_user: user.user_id === currentUser.id,
      position: index + 1
    }))
    
    // processar tentativas do usuário
    userAttempts.value = attemptsResponse.data.attempts || attemptsResponse.data || []
    
    // calcular estatísticas detalhadas
    calculateStatistics(userAttempts.value)
    
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
    // Dados de exemplo para debug
    stats.value = {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      averageTime: 0,
      totalCorrect: 0,
      totalWrong: 0
    }
  }
}

const calculateStatistics = (attempts) => {
  if (attempts.length === 0) {
    stats.value = {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      averageTime: 0,
      totalCorrect: 0,
      totalWrong: 0
    }
    return
  }
  
  const totalScore = attempts.reduce((acc, attempt) => acc + attempt.score, 0)
  const totalTime = attempts.reduce((acc, attempt) => acc + (attempt.time_spent || 0), 0)
  const totalCorrect = attempts.reduce((acc, attempt) => acc + (attempt.correct_answers || 0), 0)
  const totalWrong = attempts.reduce((acc, attempt) => acc + (attempt.wrong_answers || 0), 0)
  const bestScore = Math.max(...attempts.map(attempt => attempt.score))
  
  stats.value = {
    totalQuizzes: attempts.length,
    averageScore: Math.round(totalScore / attempts.length),
    bestScore: bestScore,
    averageTime: Math.round(totalTime / attempts.length),
    totalCorrect: totalCorrect,
    totalWrong: totalWrong
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Não finalizada'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-green-500'
  if (score >= 50) return 'text-yellow-500'
  return 'text-red-500'
}

const viewResults = (attemptId) => {
  router.push(`/results/${attemptId}`)
}

const handleLogout = async () => {
  if (!confirm('Tem certeza que deseja sair?')) {
    return
  }
  
  try {
    await authService.logout()
  } catch (error) {
    console.log('Erro no logout (API), mas continuando...', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('current_quiz_attempt')
    router.push('/')
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>