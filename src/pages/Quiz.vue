<template>
  <div class="min-h-screen bg-[url('https://wallpaperaccess.com/full/1092679.jpg')] bg-cover bg-center bg-fixed p-6 relative flex items-center justify-center">
    <div class="absolute inset-0 bg-gray-900/90 z-0"></div>

    <div class="relative z-10 w-full max-w-4xl">
      <!-- Header do Quiz -->
      <div class="flex justify-between items-end mb-8">
        <div>
          <h2 class="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <span class="w-2 h-8 bg-[#EC1D24] block transform -skew-x-12"></span>
            Questão {{ currentQuestion + 1 }} de {{ questions.length }}
          </h2>
        </div>
        <div class="bg-gray-800 border border-gray-600 px-6 py-2 transform -skew-x-12 shadow-[4px_4px_0_#EC1D24]">
          <span class="text-white font-black text-xl transform skew-x-12 block">
            Pontuação: {{ score }}
          </span>
        </div>
      </div>

      <div class="bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-2xl relative overflow-hidden group">
        <!-- Barra de Progresso -->
        <div class="absolute top-0 left-0 w-full h-2 bg-gray-700">
          <div 
            class="h-full bg-[#EC1D24] transition-all duration-500 ease-out relative"
            :style="{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }"
          >
            <div class="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse"></div>
          </div>
        </div>

        <div class="p-8 md:p-12" v-if="questions[currentQuestion]">
          <!-- Contador de Questão -->
          <div class="mb-6 flex items-center gap-3">
            <span class="bg-[#EC1D24] text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">Questão {{ currentQuestion + 1 }} / {{ questions.length }}</span>
            <div class="h-px flex-1 bg-gray-700"></div>
          </div>

          <!-- Pergunta -->
          <h3 class="text-2xl md:text-3xl font-bold text-white mb-10 leading-tight">
            {{ questions[currentQuestion].question_text }}
          </h3>

          <!-- Opções -->
          <div class="space-y-4">
            <button
              v-for="option in questions[currentQuestion].options"
              :key="option.id"
              @click="selectOption(option)"
              class="w-full p-6 text-left border-2 transition-all duration-200 group relative overflow-hidden"
              :class="selectedOption?.id === option.id 
                ? 'bg-[#EC1D24] border-[#EC1D24] text-white transform -translate-y-1 shadow-lg' 
                : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800'"
            >
              <div class="flex items-center gap-4 relative z-10">
                <div 
                  class="w-8 h-8 flex items-center justify-center border-2 font-bold transition-colors duration-200"
                  :class="selectedOption?.id === option.id ? 'border-white text-white' : 'border-gray-600 text-gray-500 group-hover:border-gray-400'"
                >
                  {{ String.fromCharCode(65 + questions[currentQuestion].options.indexOf(option)) }}
                </div>
                <span class="text-lg font-medium">{{ option.option_text }}</span>
              </div>
              
              <!-- Efeito de fundo ao selecionar -->
              <div 
                class="absolute inset-0 bg-white/10 transform origin-left transition-transform duration-300"
                :class="selectedOption?.id === option.id ? 'scale-x-100' : 'scale-x-0'"
              ></div>
            </button>
          </div>

          <!-- Ações -->
          <div class="mt-10 flex justify-between items-center pt-8 border-t border-gray-700">
            <button
              @click="previousQuestion"
              :disabled="currentQuestion === 0"
              class="text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              Anterior
            </button>

            <button
              @click="nextQuestion"
              :disabled="!selectedOption"
              class="bg-white text-gray-900 px-8 py-4 font-black uppercase tracking-widest hover:bg-[#EC1D24] hover:text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900 flex items-center gap-3 clip-path-slant"
            >
              {{ currentQuestion === questions.length - 1 ? 'finalizar' : 'próxima' }}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-else class="p-20 text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#EC1D24] mx-auto mb-6"></div>
          <p class="text-white font-bold uppercase tracking-widest animate-pulse">Carregando...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { quizService } from '@/services/api'

const router = useRouter()
const route = useRoute()

const questions = ref([])
const currentQuestion = ref(0)
const selectedOption = ref(null)
const score = ref(0)
const quizAttemptId = ref(null)
const loading = ref(true)

// obter attempt_id
const getAttemptId = () => {
  const urlAttempt = route.query.attempt

  if (urlAttempt) {
    quizAttemptId.value = parseInt(urlAttempt)
    return quizAttemptId.value
  }

  const localAttempt = localStorage.getItem('current_quiz_attempt')
  
  if (localAttempt) {
    quizAttemptId.value = parseInt(localAttempt)
    return quizAttemptId.value
  }
  
  alert('sessão de quiz não encontrada. voltando ao dashboard...')
  router.push('/dashboard')
  return null
}

const selectOption = (option) => {
  selectedOption.value = option
}

const nextQuestion = async () => {
  
  if (!selectedOption.value) {
    return
  }
  
  const attemptId = getAttemptId()
  if (!attemptId) return

  try {

    // enviar resposta atual
    await quizService.submitAnswer({
      quiz_attempt_id: attemptId,
      question_id: questions.value[currentQuestion.value].id,
      option_id: selectedOption.value.id
    })

    // verificar se é a última questão
    if (currentQuestion.value < questions.value.length - 1) {
      // próxima questão
      currentQuestion.value++
      selectedOption.value = null
    } else {
      // última questão - finalizar quiz
      
      const timeSpent = Math.floor((Date.now() - startTime.value) / 1000)
      
      const completeData = {
        quiz_attempt_id: attemptId,
        time_spent: timeSpent
      }
      
      const completeResponse = await quizService.completeQuiz(completeData)
      
      // salvar dados no localstorage para debug
      localStorage.setItem('last_quiz_complete', JSON.stringify(completeResponse.data))
      localStorage.setItem('last_attempt_id', attemptId.toString())
      
      // limpar tentativa atual
      localStorage.removeItem('current_quiz_attempt')
      
      // redirecionando para resultados
      router.push(`/results/${attemptId}`)
    }

  } catch (error) {
    alert('erro ao processar resposta: ' + (error.response?.data?.message || error.message))
  }
}

const previousQuestion = () => {
  // voltando questão
  if (currentQuestion.value > 0) {
    currentQuestion.value--
    selectedOption.value = null
  }
}

// timer para calcular tempo gasto
const startTime = ref(Date.now())

onMounted(async () => {
  
  const attemptId = getAttemptId()
  if (!attemptId) return

  try {
    // buscando questões da api
    const response = await quizService.getQuestions()
    
    questions.value = response.data.questions || response.data
    
  } catch (error) {
    alert('erro ao carregar questões: ' + (error.response?.data?.message || error.message))
    router.push('/dashboard')
  } finally {
    loading.value = false
  }
})
</script>