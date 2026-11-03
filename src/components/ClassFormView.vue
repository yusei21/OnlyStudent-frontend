<script setup>
import { reactive } from 'vue'
defineProps({ loading: Boolean, error: { type: String, default: '' } })
const emit = defineEmits(['navigate', 'submit'])
const form = reactive({ name: '', description: '', coverImageUrl: '', profileImageUrl: '' })
</script>
<template>
  <section class="container workspace">
    <div class="workspace-heading"><div><span class="eyebrow">ÁREA DO PROFESSOR</span><h1>Nova turma</h1></div><button class="text-button" @click="emit('navigate', 'dashboard')">← Minhas turmas</button></div>
    <p v-if="error" class="message error" role="alert">{{ error }}</p>
    <form class="form-card create-form" @submit.prevent="emit('submit', { ...form })">
      <label>Nome da turma<input v-model.trim="form.name" maxlength="100" required placeholder="Ex.: Matemática I"></label>
      <label>Descrição<textarea v-model.trim="form.description" rows="5" required placeholder="O que os alunos vão estudar?"></textarea></label>
      <label>URL da imagem de capa (opcional)<input v-model.trim="form.coverImageUrl" type="url" placeholder="https://exemplo.com/capa.jpg"></label>
      <label>URL da imagem de perfil (opcional)<input v-model.trim="form.profileImageUrl" type="url" placeholder="https://exemplo.com/perfil.jpg"></label>
      <p class="form-hint">As imagens devem estar hospedadas em URLs públicas. A API salva os links, não os arquivos. A turma será gratuita.</p>
      <button class="button dark" :disabled="loading">{{ loading ? 'Criando…' : 'Criar turma' }}</button>
    </form>
  </section>
</template>