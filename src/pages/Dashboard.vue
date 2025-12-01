<template>
  <div class="min-h-screen bg-[url('https://wallpaperaccess.com/full/1092679.jpg')] bg-cover bg-center bg-fixed p-6 relative">
    <div class="absolute inset-0 bg-gray-900/90 z-0"></div>
    
    <div class="relative z-10 max-w-6xl mx-auto">
      <!-- header com Logout -->
      <div class="mb-10 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-700 pb-6">
        <div>
          <h1 class="text-4xl font-black text-white uppercase italic tracking-tighter transform -skew-x-12">
            <span class="text-[#EC1D24]">Dashboard</span>
          </h1>
          <p class="text-gray-400 mt-1 font-medium tracking-wide uppercase text-sm">Bem-vindo, <span class="text-white">{{ userName }}</span>!</p>
        </div>
        <button 
          @click="handleLogout"
          class="bg-gray-800 border border-gray-600 text-gray-300 px-6 py-2 font-bold uppercase tracking-wider hover:bg-[#EC1D24] hover:text-white hover:border-[#EC1D24] transition-all duration-300 clip-path-slant flex items-center gap-2 group"
        >
          <svg class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Sair
        </button>
      </div>

      <!-- informações do Quiz -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-gray-800/80 backdrop-blur-sm border-l-4 border-[#EC1D24] p-6 shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total de Questões</p>
          <p class="text-4xl font-black text-white">10</p>
        </div>
        <div class="bg-gray-800/80 backdrop-blur-sm border-l-4 border-blue-500 p-6 shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tempo Médio</p>
          <p class="text-4xl font-black text-white">{{ stats.averageTime }}<span class="text-lg text-gray-500 ml-1">seg</span></p>
        </div>
        <div class="bg-gray-800/80 backdrop-blur-sm border-l-4 border-yellow-500 p-6 shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pontos por Acerto</p>
          <p class="text-4xl font-black text-white">10</p>
        </div>
      </div>

      <!-- grid principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <!-- ranking Geral -->
        <div class="lg:col-span-2 bg-gray-800/90 backdrop-blur-md border border-gray-700 p-8 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-[#EC1D24]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <h2 class="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-3">
            <span class="w-2 h-8 bg-[#EC1D24] block transform -skew-x-12"></span>
            Ranking Geral
          </h2>
          
          <div v-if="ranking.length > 0" class="space-y-3">
            <div v-for="(user, index) in ranking" :key="user.user_id" 
                 class="flex items-center justify-between p-4 border-b border-gray-700 hover:bg-white/5 transition duration-300 group"
                 :class="user.is_current_user ? 'bg-[#EC1D24]/10 border-l-4 border-l-[#EC1D24]' : ''">
              <div class="flex items-center">
                <span class="text-2xl font-black mr-4 w-8 text-center" 
                      :class="index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-700' : 'text-gray-600'">
                  {{ index + 1 }}º
                </span>
                <div>
                  <p class="font-bold text-white uppercase tracking-wide flex items-center gap-2 group-hover:text-[#EC1D24] transition-colors">
                    {{ user.name }}
                    <span v-if="user.is_current_user" class="text-[10px] bg-[#EC1D24] text-white px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold">
                      Você
                    </span>
                  </p>
                  <div class="text-xs text-gray-500 flex gap-3 mt-1 font-mono">
                    <span>Melhor: <span class="text-gray-300">{{ user.best_score }}%</span></span>
                    <span>|</span>
                    <span>Média: <span class="text-gray-300">{{ user.avg_score }}%</span></span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xl font-black text-white">{{ user.avg_score }}%</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-wider">{{ user.total_attempts }} tentativa{{ user.total_attempts !== 1 ? 's' : '' }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12 border border-dashed border-gray-700 rounded-lg">
            <p class="text-gray-500 uppercase tracking-widest text-sm">Nenhum ranking disponível ainda</p>
          </div>
        </div>

        <!-- suas estatísticas -->
        <div class="bg-gray-800/90 backdrop-blur-md border border-gray-700 p-8 shadow-2xl">
          <h2 class="text-xl font-black text-white uppercase italic mb-6 border-b border-gray-700 pb-2">
            Suas Estatísticas
          </h2>
          <div class="space-y-8">
            <div class="text-center relative">
              <svg class="w-40 h-40 mx-auto transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="10" fill="transparent" class="text-gray-700" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="10" fill="transparent" 
                        :stroke-dasharray="440" 
                        :stroke-dashoffset="440 - (440 * stats.averageScore) / 100"
                        class="text-[#EC1D24] transition-all duration-1000 ease-out" />
              </svg>
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span class="text-3xl font-black text-white block">{{ stats.averageScore }}%</span>
                <span class="text-[10px] text-gray-400 uppercase tracking-widest">Média de Acertos</span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-900/50 p-4 border border-gray-700 text-center hover:border-[#EC1D24] transition-colors duration-300">
                <p class="text-2xl font-black text-white">{{ stats.totalQuizzes }}</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-widest">Tentativas</p>
              </div>
              <div class="bg-gray-900/50 p-4 border border-gray-700 text-center hover:border-[#EC1D24] transition-colors duration-300">
                <p class="text-2xl font-black text-green-500">{{ stats.bestScore }}%</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-widest">Melhor</p>
              </div>
              <div class="bg-gray-900/50 p-4 border border-gray-700 text-center hover:border-[#EC1D24] transition-colors duration-300">
                <p class="text-2xl font-black text-blue-500">{{ stats.totalCorrect }}</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-widest">Acertos</p>
              </div>
              <div class="bg-gray-900/50 p-4 border border-gray-700 text-center hover:border-[#EC1D24] transition-colors duration-300">
                <p class="text-2xl font-black text-red-500">{{ stats.totalWrong }}</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-widest">Erros</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- tentativas do usuário -->
      <div class="bg-gray-800/90 backdrop-blur-md border border-gray-700 p-8 shadow-2xl mb-10">
        <div class="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h2 class="text-2xl font-black text-white uppercase italic flex items-center gap-3">
            <span class="w-2 h-8 bg-blue-600 block transform -skew-x-12"></span>
            Suas Tentativas
          </h2>
          <span class="text-xs font-bold bg-gray-700 text-gray-300 px-3 py-1 rounded-full uppercase tracking-wider">{{ userAttempts.length }} tentativa{{ userAttempts.length !== 1 ? 's' : '' }}</span>
        </div>
        
        <div v-if="userAttempts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="attempt in userAttempts" 
            :key="attempt.id" 
            @click="viewResults(attempt.id)"
            class="group bg-gray-900 border border-gray-700 p-5 hover:border-[#EC1D24] cursor-pointer transition-all duration-300 relative overflow-hidden"
          >
            <div class="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-[#EC1D24]/20"></div>
            
            <div class="flex justify-between items-start mb-3">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Tentativa #{{ attempt.id }}</span>
              <span class="text-xl font-black" :class="getScoreColor(attempt.score)">{{ attempt.score }}%</span>
            </div>
            
            <div class="space-y-2 text-sm text-gray-400">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {{ formatDate(attempt.completed_at) }}
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                {{ attempt.time_spent }}s
              </div>
            </div>
            
            <div class="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center">
              <span class="text-xs text-gray-500 uppercase font-bold">{{ attempt.correct_answers }}/10 acertos</span>
              <span class="text-[#EC1D24] text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">Ver Detalhes &rarr;</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-16">
          <div class="inline-block p-4 rounded-full bg-gray-700/50 mb-4">
            <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <p class="text-gray-400 uppercase tracking-widest font-bold mb-6">Você ainda não completou nenhum quiz</p>
          <button 
            @click="startNewQuiz"
            class="bg-[#EC1D24] text-white px-8 py-3 font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-[0_4px_0_rgb(153,27,27)] hover:shadow-[0_2px_0_rgb(153,27,27)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
          >
            Iniciar Primeiro Quiz
          </button>
        </div>
      </div>

      <!-- botões de ação -->
      <div class="flex flex-col sm:flex-row gap-6">
        <button 
          @click="startNewQuiz"
          :disabled="startingQuiz"
          class="flex-1 bg-[#EC1D24] text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-[0_4px_0_rgb(153,27,27)] hover:shadow-[0_2px_0_rgb(153,27,27)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg clip-path-slant"
        >
          <svg v-if="startingQuiz" class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ startingQuiz ? 'Iniciando...' : 'Iniciar Novo Quiz' }}
        </button>

        <button 
          @click="resetAttempts"
          class="px-8 py-4 bg-yellow-600 text-white font-black uppercase tracking-widest hover:bg-yellow-700 transition-all shadow-[0_4px_0_rgb(180,83,9)] hover:shadow-[0_2px_0_rgb(180,83,9)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] flex items-center justify-center gap-3 clip-path-slant"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
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
    if (error.response?.data?.error?.includes('Attempt to read property "id" on null')) {
      alert('Erro: Não há questões cadastradas no sistema. Por favor, contate o administrador.')
    } else {
      alert('Erro ao iniciar quiz. Tente novamente.')
    }
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