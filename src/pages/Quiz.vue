<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div class="bg-red-600 text-white p-6 rounded-t-lg">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">Questão {{ currentQuestion + 1 }} de {{ questions.length }}</h2>
          <div>Pontuação: {{ score }}</div>
        </div>
      </div>

      <div class="p-6" v-if="questions[currentQuestion]">
        <h3 class="text-lg font-semibold mb-4">{{ questions[currentQuestion].question_text }}</h3>

        <div class="space-y-3">
          <button
            v-for="option in questions[currentQuestion].options"
            :key="option.id"
            @click="selectOption(option)"
            class="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            :class="selectedOption?.id === option.id ? 'bg-blue-50 border-blue-300' : ''"
          >
            {{ option.option_text }}
          </button>
        </div>

        <div class="mt-6 flex justify-between">
          <button
            @click="previousQuestion"
            :disabled="currentQuestion === 0"
            class="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <button
            @click="nextQuestion"
            :disabled="!selectedOption"
            class="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {{ currentQuestion === questions.length - 1 ? 'finalizar' : 'próxima' }}
          </button>
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