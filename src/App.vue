<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const checkAuth = () => {
  const currentPath = route.path
  
  // permitir tudo
  return true
}

onMounted(() => {
  checkAuth()
})

watch(
  () => route.path,
  (newPath) => {
    
  }
)
</script>