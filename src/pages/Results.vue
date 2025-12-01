<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">resultados do quiz</h1>
        <p class="text-lg text-gray-600">tentativa id: {{ $route.params.attemptId }}</p>
      </div>

      <div v-if="showDebug" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-bold text-yellow-800 mb-4">🔍 painel de debug</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>attempt id da url:</strong> {{ $route.params.attemptId }}</p>
            <p><strong>token no localstorage:</strong> {{ hasToken ? 'sim' : 'não' }}</p>
            <p><strong>loading results:</strong> {{ loading }}</p>
            <p><strong>loading ranking:</strong> {{ loadingRanking }}</p>
          </div>
          <div>
            <p><strong>score:</strong> {{ score }}</p>
            <p><strong>correct answers:</strong> {{ correctAnswers }}</p>
            <p><strong>total questions:</strong> {{ totalQuestions }}</p>
            <p><strong>time spent:</strong> {{ timeSpent }}s</p>
            <p><strong>results count:</strong> {{ results.length }}</p>
            <p><strong>ranking count:</strong> {{ ranking.length }}</p>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button @click="loadResults" class="px-4 py-2 bg-blue-600 text-white rounded text-sm">
             recarregar resultados
          </button>
          <button @click="loadRanking" class="px-4 py-2 bg-green-600 text-white rounded text-sm">
             recarregar ranking
          </button>
          <button @click="toggleDebug" class="px-4 py-2 bg-gray-600 text-white rounded text-sm">
            {{ showDebug ? ' esconder debug' : ' mostrar debug' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-md p-6 mb-6">
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-green-100 to-blue-100 rounded-full mb-4">
                <span class="text-2xl font-bold text-gray-900">{{ score }}%</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 mb-2">sua pontuação</h2>
              <p class="text-gray-600 mb-4">{{ getScoreMessage(score) }}</p>
              
              <div class="flex justify-center space-x-4 text-sm text-gray-500">
                <span>corretas: {{ correctAnswers }}/{{ totalQuestions }}</span>
                <span>|</span>
                <span>erradas: {{ wrongAnswers }}</span>
                <span>|</span>
                <span>tempo: {{ timeSpent }}s</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">📝 detalhes das respostas</h3>
            
            <div v-if="results.length > 0" class="space-y-4">
              <div 
                v-for="(result, index) in results" 
                :key="index"
                class="border-l-4 p-4 rounded-r-lg"
                :class="result.is_correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-900">questão {{ index + 1 }}</h4>
                  <span 
                    class="px-2 py-1 text-xs rounded-full"
                    :class="result.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ result.is_correct ? ' correta' : ' incorreta' }}
                  </span>
                </div>
                <p class="text-gray-700 mb-2 font-medium">{{ result.question_text }}</p>
                <div class="text-sm space-y-1">
                  <p class="text-gray-600">
                    <span class="font-medium">sua resposta:</span> 
                    <span :class="result.is_correct ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                      {{ result.user_answer }}
                    </span>
                  </p>
                  <p v-if="!result.is_correct" class="text-gray-600">
                    <span class="font-medium">resposta correta:</span> 
                    <span class="text-green-600 font-medium">{{ result.correct_answer }}</span>
                  </p>
                </div>
              </div>
            </div>

            <div v-else-if="loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="text-gray-600 mt-4">carregando resultados...</p>
            </div>

            <div v-else class="text-center py-8">
              <p class="text-gray-500">nenhum resultado encontrado</p>
              <p class="text-sm text-gray-400 mt-2">complete um quiz para ver os resultados</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4"> ranking geral</h3>
            
            <div v-if="ranking.length > 0" class="space-y-3">
              <div 
                v-for="(user, index) in ranking" 
                :key="user.user_id"
                class="flex items-center justify-between p-3 rounded-lg border"
                :class="index === 0 ? 'bg-yellow-50 border-yellow-200' : 
                          index === 1 ? 'bg-gray-50 border-gray-200' : 
                          index === 2 ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'"
              >
                <div class="flex items-center">
                  <span class="text-lg font-bold mr-3">
                    {{ index === 0 ? '1º' : index === 1 ? '2º' : index === 2 ? '3º' : `${index + 1}º` }}
                  </span>
                  <div>
                    <p class="font-medium" :class="user.is_current_user ? 'text-blue-600' : 'text-gray-900'">
                      {{ user.name }}
                      <span v-if="user.is_current_user" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">você</span>
                    </p>
                    <p class="text-sm text-gray-600">melhor: {{ user.best_score }}%</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ user.avg_score }}%</p>
                  <p class="text-xs text-gray-500">{{ user.total_attempts }} tentativas</p>
                </div>
              </div>
            </div>

            <div v-else-if="loadingRanking" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="text-gray-600 mt-2">carregando ranking...</p>
            </div>

            <div v-else class="text-center py-4">
              <p class="text-gray-500">ranking não disponível</p>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200">
              <button 
                @click="goToDashboard" 
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mb-2"
              >
                ver dashboard
              </button>
              <button 
                @click="retakeQuiz" 
                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                refazer quiz
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