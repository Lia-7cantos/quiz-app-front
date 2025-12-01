<template>
  <div class="min-h-screen bg-[url('https://wallpaperaccess.com/full/1092679.jpg')] bg-cover bg-center bg-fixed py-8 relative">
    <div class="absolute inset-0 bg-gray-900/90 z-0"></div>
    
    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-black text-white uppercase italic tracking-tighter mb-2 flex items-center justify-center gap-3">
          <span class="w-2 h-8 bg-[#EC1D24] block transform -skew-x-12"></span>
          Relatório da Missão
        </h1>
        <p class="text-gray-400 font-mono text-sm uppercase tracking-widest">Protocolo ID: {{ $route.params.attemptId }}</p>
      </div>

      <div v-if="showDebug" class="bg-gray-800/80 border border-yellow-600/30 rounded-lg p-6 mb-6 backdrop-blur-sm">
        <h3 class="text-lg font-bold text-yellow-500 mb-4 uppercase tracking-widest flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          Painel de Diagnóstico
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-gray-400">
          <div>
            <p><strong class="text-gray-300">Attempt ID:</strong> {{ $route.params.attemptId }}</p>
            <p><strong class="text-gray-300">Token Status:</strong> {{ hasToken ? 'Ativo' : 'Inativo' }}</p>
            <p><strong class="text-gray-300">Loading Results:</strong> {{ loading }}</p>
            <p><strong class="text-gray-300">Loading Ranking:</strong> {{ loadingRanking }}</p>
          </div>
          <div>
            <p><strong class="text-gray-300">Score:</strong> {{ score }}</p>
            <p><strong class="text-gray-300">Correct:</strong> {{ correctAnswers }}</p>
            <p><strong class="text-gray-300">Total:</strong> {{ totalQuestions }}</p>
            <p><strong class="text-gray-300">Time:</strong> {{ timeSpent }}s</p>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button @click="loadResults" class="px-4 py-2 bg-blue-900/50 text-blue-300 border border-blue-800 rounded hover:bg-blue-900 transition text-xs uppercase tracking-wider">
             Recarregar Dados
          </button>
          <button @click="loadRanking" class="px-4 py-2 bg-green-900/50 text-green-300 border border-green-800 rounded hover:bg-green-900 transition text-xs uppercase tracking-wider">
             Atualizar Ranking
          </button>
          <button @click="toggleDebug" class="px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded hover:bg-gray-600 transition text-xs uppercase tracking-wider">
            {{ showDebug ? 'Ocultar Painel' : 'Mostrar Painel' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <!-- Card de Pontuação -->
          <div class="bg-gray-800/90 backdrop-blur-md border border-gray-700 p-8 shadow-2xl mb-8 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-[#EC1D24]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
            <div class="text-center relative z-10">
              <div class="inline-flex items-center justify-center w-32 h-32 relative mb-6">
                <!-- Círculo de fundo -->
                <svg class="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="60" stroke="currentColor" stroke-width="8" fill="transparent" class="text-gray-700" />
                  <circle cx="64" cy="64" r="60" stroke="currentColor" stroke-width="8" fill="transparent" 
                          :stroke-dasharray="377" 
                          :stroke-dashoffset="377 - (377 * score) / 100"
                          class="text-[#EC1D24] transition-all duration-1000 ease-out" />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center flex-col">
                  <span class="text-3xl font-black text-white">{{ score }}%</span>
                </div>
              </div>
              
              <h2 class="text-2xl font-black text-white uppercase italic mb-2">Desempenho da Missão</h2>
              <p class="text-[#EC1D24] font-bold uppercase tracking-widest mb-6">{{ getScoreMessage(score) }}</p>
              
              <div class="flex justify-center flex-wrap gap-4 text-sm">
                <div class="bg-gray-900/50 border border-gray-700 px-4 py-2 rounded">
                  <span class="text-gray-400 uppercase text-xs block">Acertos</span>
                  <span class="text-green-500 font-bold text-lg">{{ correctAnswers }}/{{ totalQuestions }}</span>
                </div>
                <div class="bg-gray-900/50 border border-gray-700 px-4 py-2 rounded">
                  <span class="text-gray-400 uppercase text-xs block">Erros</span>
                  <span class="text-red-500 font-bold text-lg">{{ wrongAnswers }}</span>
                </div>
                <div class="bg-gray-900/50 border border-gray-700 px-4 py-2 rounded">
                  <span class="text-gray-400 uppercase text-xs block">Tempo</span>
                  <span class="text-blue-500 font-bold text-lg">{{ timeSpent }}s</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Detalhes das Respostas -->
          <div class="bg-gray-800/90 backdrop-blur-md border border-gray-700 p-8 shadow-2xl">
            <h3 class="text-xl font-black text-white uppercase italic mb-6 flex items-center gap-3">
              <span class="w-2 h-8 bg-gray-600 block transform -skew-x-12"></span>
              Análise Tática
            </h3>
            
            <div v-if="results.length > 0" class="space-y-4">
              <div 
                v-for="(result, index) in results" 
                :key="index"
                class="border-l-4 p-5 bg-gray-900/50 transition-all hover:bg-gray-900"
                :class="result.is_correct ? 'border-green-500' : 'border-red-500'"
              >
                <div class="flex justify-between items-start mb-3">
                  <h4 class="font-bold text-white uppercase tracking-wide text-sm">Alvo {{ index + 1 }}</h4>
                  <span 
                    class="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm"
                    :class="result.is_correct ? 'bg-green-900/30 text-green-400 border border-green-900' : 'bg-red-900/30 text-red-400 border border-red-900'"
                  >
                    {{ result.is_correct ? 'Sucesso' : 'Falha' }}
                  </span>
                </div>
                <p class="text-gray-300 mb-4 font-medium">{{ result.question_text }}</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div class="p-3 rounded bg-black/20 border border-gray-800">
                    <span class="text-gray-500 uppercase text-xs font-bold block mb-1">Sua Escolha</span>
                    <span :class="result.is_correct ? 'text-green-400 font-bold' : 'text-red-400 font-bold'">
                      {{ result.user_answer }}
                    </span>
                  </div>
                  <div v-if="!result.is_correct" class="p-3 rounded bg-black/20 border border-gray-800">
                    <span class="text-gray-500 uppercase text-xs font-bold block mb-1">Solução Correta</span>
                    <span class="text-green-400 font-bold">{{ result.correct_answer }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="loading" class="text-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#EC1D24] mx-auto"></div>
              <p class="text-gray-400 mt-4 uppercase tracking-widest text-sm">Processando Dados...</p>
            </div>

            <div v-else class="text-center py-12 border border-dashed border-gray-700 rounded">
              <p class="text-gray-500 uppercase tracking-widest">Nenhum dado encontrado</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-gray-800/90 backdrop-blur-md border border-gray-700 p-6 shadow-2xl sticky top-4">
            <h3 class="text-lg font-black text-white uppercase italic mb-6 border-b border-gray-700 pb-4">
              Classificação Global
            </h3>
            
            <div v-if="ranking.length > 0" class="space-y-3">
              <div 
                v-for="(user, index) in ranking" 
                :key="user.user_id"
                class="flex items-center justify-between p-3 rounded border transition-colors"
                :class="index === 0 ? 'bg-yellow-900/10 border-yellow-700/50' : 
                          index === 1 ? 'bg-gray-700/30 border-gray-600/50' : 
                          index === 2 ? 'bg-orange-900/10 border-orange-800/50' : 'bg-transparent border-gray-800'"
              >
                <div class="flex items-center">
                  <span class="text-lg font-black mr-3 w-6 text-center"
                    :class="index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-600'"
                  >
                    {{ index + 1 }}
                  </span>
                  <div>
                    <p class="font-bold text-sm uppercase tracking-wide" :class="user.is_current_user ? 'text-[#EC1D24]' : 'text-gray-300'">
                      {{ user.name }}
                      <span v-if="user.is_current_user" class="text-[10px] bg-[#EC1D24] text-white px-1.5 py-0.5 rounded ml-1">EU</span>
                    </p>
                    <p class="text-xs text-gray-500 font-mono">Best: {{ user.best_score }}%</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-black text-white">{{ user.avg_score }}%</p>
                  <p class="text-[10px] text-gray-500 uppercase">{{ user.total_attempts }} runs</p>
                </div>
              </div>
            </div>

            <div v-else-if="loadingRanking" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#EC1D24] mx-auto"></div>
            </div>

            <div v-else class="text-center py-8">
              <p class="text-gray-500 text-sm uppercase">Ranking Indisponível</p>
            </div>

            <div class="mt-8 pt-6 border-t border-gray-700 space-y-3">
              <button 
                @click="goToDashboard" 
                class="w-full px-4 py-3 bg-gray-700 text-white font-bold uppercase tracking-widest hover:bg-gray-600 transition clip-path-slant"
              >
                Voltar à Base
              </button>
              <button 
                @click="retakeQuiz" 
                class="w-full px-4 py-3 bg-[#EC1D24] text-white font-black uppercase tracking-widest hover:bg-red-700 transition shadow-lg clip-path-slant"
              >
                Nova Missão
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { quizService } from '@/services/api'

const router = useRouter()
const route = useRoute()

// dados dos resultados
const score = ref(0)
const correctAnswers = ref(0)
const totalQuestions = ref(10)
const timeSpent = ref(0)
const results = ref([])
const loading = ref(true)

// dados do ranking
const ranking = ref([])
const loadingRanking = ref(true)

// debug info
const hasToken = ref(false)
const userInfo = ref('')
const showDebug = ref(true) 
// computed para respostas erradas
const wrongAnswers = computed(() => {
  return totalQuestions.value - correctAnswers.value
})

// mensagens baseadas na pontuação
const getScoreMessage = (score) => {
  if (score >= 90) return 'excelente! '
  if (score >= 70) return 'muito bom! '
  if (score >= 50) return 'bom trabalho! '
  return 'estude mais! 📚'
}

// verificar localstorage
const checkLocalStorage = () => {
  // token no localstorage
  localStorage.getItem('token')
  // user no localstorage
  localStorage.getItem('user')
  // último quiz completo no localstorage
  localStorage.getItem('last_quiz_complete')
  // último attempt id no localstorage
  localStorage.getItem('last_attempt_id')
  // attempt atual no localstorage
  localStorage.getItem('current_quiz_attempt')
}

// toggle debug panel
const toggleDebug = () => {
  showDebug.value = !showDebug.value
}

const loadResults = async () => {
  const currentAttemptId = route.params.attemptId
  
  try {
    loading.value = true
    
    if (!currentAttemptId || currentAttemptId === 'undefined') {
      throw new Error('id da tentativa não encontrado')
    }

    // usar o quiz service
    const response = await quizService.getResults(currentAttemptId)
    
    const data = response.data

    // preencher dados
    if (data.success || data.final_score !== undefined) {
      score.value = data.final_score || data.score || 0
      correctAnswers.value = data.correct_answers || 0
      totalQuestions.value = data.total_questions || 10
      timeSpent.value = data.time_spent || 0
      results.value = data.results || data.answers || []
      
    } else {
      throw new Error('estrutura de dados inválida')
    }

  } catch (error) {
    
    // tentar fallback se o service falhar
    if (currentAttemptId) {
      await loadResultsFallback(currentAttemptId)
    }
  } finally {
    loading.value = false
  }
}

// função de fallback
const loadResultsFallback = async (attemptId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/fixed/results/${attemptId}`, {
      headers: {
        'authorization': `bearer ${localStorage.getItem('token')}`,
        'content-type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (data.success) {
      score.value = data.final_score || 0
      correctAnswers.value = data.correct_answers || 0
      totalQuestions.value = data.total_questions || 10
      timeSpent.value = data.time_spent || 0
      results.value = data.results || []
    }
  } catch (fallbackError) {
    // dados de exemplo
    score.value = 80
    correctAnswers.value = 8
    timeSpent.value = 88
    results.value = [{
      question_text: "quiz marvel - pergunta exemplo",
      user_answer: "sua resposta",
      correct_answer: "resposta correta",
      is_correct: true
    }]
  }
}

// buscar ranking da api
const loadRanking = async () => {
  try {
    loadingRanking.value = true
    
    const response = await quizService.getRanking()
    
    const rankingData = response.data.ranking || response.data || []

    // buscar nomes dos usuários
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

    // mapear ranking
    ranking.value = rankingData.map((user, index) => {
      return {
        user_id: user.user_id,
        name: user.name || `jogador ${user.user_id}`,
        best_score: user.best_score || 0,
        avg_score: user.avg_score || 0,
        total_attempts: user.total_attempts || 0,
        total_time: user.total_time || 0,
        is_current_user: user.user_id === currentUser.id,
        position: index + 1
      }
    })

  } catch (error) {
    ranking.value = []
  } finally {
    loadingRanking.value = false
  }
}

// navegação
const retakeQuiz = () => {
  router.push('/quiz')
}

const goToDashboard = () => {
  router.push('/dashboard')
}

// carregar tudo quando o componente montar
onMounted(async () => {
  
  // setup debug info
  hasToken.value = !!localStorage.getItem('token')
  userInfo.value = localStorage.getItem('user') || 'nenhum'
  
  // verificar localstorage
  checkLocalStorage()
  
  // carregar resultados primeiro, depois ranking
  try {
    await loadResults()
    await loadRanking()
  } catch (error) {
    // erro ao carregar dados
  }
})
</script>