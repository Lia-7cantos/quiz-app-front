<template>
  <div class="min-h-screen bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <!-- logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Quiz Marvel</h1>
        <p class="text-gray-600">Entre na sua conta</p>
      </div>

      <!-- formulário de Login -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="seu@email.com"
          >
        </div>

        <!-- senha -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Sua senha"
          >
        </div>

        <!-- botão Login -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? 'Entrando...' : 'Entrar' }}</span>
        </button>

        <!-- link para Registrar -->
        <div class="text-center">
          <button
            type="button"
            @click="showRegister = true"
            class="text-blue-600 hover:text-blue-800 font-medium"
          >
            Não tem conta? Registre-se
          </button>
        </div>
      </form>

      <!-- modal de Registro -->
      <div v-if="showRegister" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Criar Conta</h2>
            <button @click="closeRegister" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
              <input
                v-model="registerForm.name"
                type="text"
                required
                placeholder="Seu nome"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="registerForm.email"
                type="email"
                required
                placeholder="seu@email.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input
                v-model="registerForm.password"
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                minlength="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
              <input
                v-model="registerForm.password_confirmation"
                type="password"
                required
                placeholder="Confirme sua senha"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- mensagem de erro no registro -->
            <div v-if="registerError" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {{ registerError }}
            </div>

            <div class="flex gap-4 pt-4">
              <button
                type="button"
                @click="closeRegister"
                class="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="registerLoading"
                class="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium flex items-center justify-center"
              >
                <svg v-if="registerLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ registerLoading ? 'Criando...' : 'Criar Conta' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- mensagem de Erro -->
      <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/api'

const router = useRouter()

// estados
const loading = ref(false)
const error = ref('')
const showRegister = ref(false)
const registerLoading = ref(false)
const registerError = ref('')

// formulários
const form = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

// fechar modal de registro
const closeRegister = () => {
  showRegister.value = false
  registerError.value = ''
  // limpar formulário
  registerForm.value = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  }
}

// login
const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await authService.login(form.value)
    
    // salvar token e usuário
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    // redirecionar para dashboard
    router.push('/dashboard')
  } catch (err) {
    console.error('Erro no login:', err)
    
    if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Erro ao fazer login. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}

// registro
const handleRegister = async () => {
  // validações antes de enviar
  if (registerForm.value.password !== registerForm.value.password_confirmation) {
    registerError.value = 'As senhas não coincidem'
    return
  }

  if (registerForm.value.password.length < 6) {
    registerError.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  registerLoading.value = true
  registerError.value = ''

  try {
    const response = await authService.register(registerForm.value)
    
    console.log('Registro bem-sucedido:', response.data)

    // salvar token e usuário
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    // fechar modal e redirecionar
    closeRegister()
    router.push('/dashboard')
  } catch (err) {
    console.error('Erro no registro:', err)
    
    // tratamento detalhado de erros
    if (err.response?.status === 422 && err.response?.data?.errors) {
      // erros de validação do Laravel
      const errors = err.response.data.errors
      const firstError = Object.values(errors)[0][0]
      registerError.value = firstError
    } else if (err.response?.data?.message) {
      registerError.value = err.response.data.message
    } else if (err.request) {
      registerError.value = 'Erro de conexão. Verifique se o servidor está rodando.'
    } else {
      registerError.value = 'Erro ao criar conta. Tente novamente.'
    }
  } finally {
    registerLoading.value = false
  }
}
</script>