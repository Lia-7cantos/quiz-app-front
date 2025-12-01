<template>
  <div class="min-h-screen bg-[url('https://wallpaperaccess.com/full/1092679.jpg')] bg-cover bg-center flex items-center justify-center p-4 relative">
    <!-- Overlay escuro para melhorar leitura -->
    <div class="absolute inset-0 bg-gray-900/80 z-0"></div>

    <div class="bg-gray-900 border border-gray-700 rounded-none shadow-2xl p-8 w-full max-w-md relative z-10 transform transition-all hover:scale-[1.01] duration-300">
      <!-- logo/Header -->
      <div class="text-center mb-10">
        <div class="inline-block bg-[#EC1D24] text-white px-4 py-1 mb-4 transform -skew-x-12 shadow-lg">
          <h1 class="text-4xl font-black tracking-tighter uppercase transform skew-x-12">Marvel Quiz</h1>
        </div>
        <p class="text-gray-400 font-medium tracking-wide uppercase text-sm">Acesse o Universo</p>
      </div>

      <!-- formulário de Login -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- email -->
        <div class="group">
          <label class="block text-xs font-bold text-red-500 uppercase tracking-wider mb-1 group-focus-within:text-red-400 transition-colors">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#EC1D24] focus:ring-1 focus:ring-[#EC1D24] transition-all duration-300 rounded-sm"
            placeholder="seu@email.com"
          >
        </div>

        <!-- senha -->
        <div class="group">
          <label class="block text-xs font-bold text-red-500 uppercase tracking-wider mb-1 group-focus-within:text-red-400 transition-colors">Senha</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#EC1D24] focus:ring-1 focus:ring-[#EC1D24] transition-all duration-300 rounded-sm"
            placeholder="Sua senha"
          >
        </div>

        <!-- botão Login -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-[#EC1D24] hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 px-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_4px_0_rgb(153,27,27)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center clip-path-slant"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? 'Acessando...' : 'Entrar' }}</span>
        </button>

        <!-- link para Registrar -->
        <div class="text-center mt-6">
          <button
            type="button"
            @click="showRegister = true"
            class="text-gray-400 hover:text-[#EC1D24] font-bold text-sm uppercase tracking-wide transition-colors duration-300 border-b-2 border-transparent hover:border-[#EC1D24]"
          >
            Novo recruta? Registre-se
          </button>
        </div>
      </form>

      <!-- modal de Registro -->
      <div v-if="showRegister" class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-gray-900 border-2 border-[#EC1D24] p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative shadow-[0_0_50px_rgba(236,29,36,0.3)]">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-black text-white uppercase italic tracking-tighter">Nova Identidade</h2>
            <button @click="closeRegister" class="text-gray-500 hover:text-[#EC1D24] transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleRegister" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Nome de Herói</label>
              <input
                v-model="registerForm.name"
                type="text"
                required
                placeholder="Ex: Tony Stark"
                class="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#EC1D24] focus:ring-1 focus:ring-[#EC1D24] transition-all rounded-sm"
              >
            </div>

            <div>
              <label class="block text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Email</label>
              <input
                v-model="registerForm.email"
                type="email"
                required
                placeholder="seu@email.com"
                class="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#EC1D24] focus:ring-1 focus:ring-[#EC1D24] transition-all rounded-sm"
              >
            </div>

            <div>
              <label class="block text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Senha</label>
              <input
                v-model="registerForm.password"
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                minlength="6"
                class="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#EC1D24] focus:ring-1 focus:ring-[#EC1D24] transition-all rounded-sm"
              >
            </div>

            <div>
              <label class="block text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Confirmar Senha</label>
              <input
                v-model="registerForm.password_confirmation"
                type="password"
                required
                placeholder="Confirme sua senha"
                class="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#EC1D24] focus:ring-1 focus:ring-[#EC1D24] transition-all rounded-sm"
              >
            </div>

            <!-- mensagem de erro no registro -->
            <div v-if="registerError" class="p-3 bg-red-900/30 border border-red-500 text-red-200 text-sm font-medium">
              {{ registerError }}
            </div>

            <div class="flex gap-4 pt-4">
              <button
                type="button"
                @click="closeRegister"
                class="flex-1 bg-gray-700 text-white py-3 hover:bg-gray-600 transition font-bold uppercase tracking-wider text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="registerLoading"
                class="flex-1 bg-[#EC1D24] text-white py-3 hover:bg-red-700 transition disabled:opacity-50 font-bold uppercase tracking-wider text-sm flex items-center justify-center"
              >
                <svg v-if="registerLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ registerLoading ? 'Criando...' : 'Criar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- mensagem de Erro -->
      <div v-if="error" class="mt-4 p-3 bg-red-900/30 border border-red-500 text-red-200 font-medium text-center">
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