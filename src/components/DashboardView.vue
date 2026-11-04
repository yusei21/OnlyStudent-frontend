<script setup>
import { computed } from 'vue'
import ClassArtwork from './ClassArtwork.vue'

const props = defineProps({
  session: { type: Object, required: true },
  classes: { type: Array, required: true },
  loading: Boolean,
  error: { type: String, default: '' },
  notice: { type: String, default: '' }
})
const emit = defineEmits(['navigate', 'open-class'])
const isEducator = computed(() => props.session.role === 'educator')
const firstName = computed(() => props.session.name?.split(' ')[0] || 'você')
const plural = (count, single, multiple) => `${Number(count) || 0} ${Number(count) === 1 ? single : multiple}`
</script>

<template>
  <section class="container workspace">
    <div class="workspace-heading">
      <div>
        <span class="eyebrow">{{ isEducator ? 'ÁREA DO PROFESSOR' : 'ÁREA DO ALUNO' }}</span>
        <h1>Olá, {{ firstName }}.</h1>
        <p>{{ isEducator ? 'Gerencie as turmas que você criou.' : 'Acesse as turmas em que você está inscrito.' }}</p>
      </div>
      <button class="button dark" @click="emit('navigate', isEducator ? 'create' : 'catalog')">
        {{ isEducator ? '+ Criar turma' : 'Explorar turmas' }}
      </button>
    </div>

    <p v-if="notice" class="message success" role="status">{{ notice }}</p>
    <p v-if="error" class="message error" role="alert">{{ error }}</p>
    <p class="section-label">SUAS TURMAS <span>{{ classes.length }}</span></p>
    <p v-if="loading" class="empty">Carregando turmas…</p>
    <div v-else-if="classes.length" class="class-grid">
      <button v-for="item in classes" :key="item.codigo" type="button"
        class="class-card classroom-card" @click="emit('open-class', item)">
        <ClassArtwork :name="item.name" :cover-url="item.coverImageUrl"
          :profile-url="item.profileImageUrl" compact />
        <span class="classroom-card__body">
          <span class="classroom-card__title">{{ item.name }}</span>
          <span class="classroom-card__teacher">{{ item.educator || 'Professor não informado' }}</span>
          <span class="classroom-card__meta">
            <span>{{ plural(item.totalAlunos, 'aluno', 'alunos') }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ plural(item.totalMateriais, 'material', 'materiais') }}</span>
          </span>
        </span>
      </button>
    </div>
    <div v-else class="empty">
      <h2>Nenhuma turma por aqui ainda.</h2>
      <p>{{ isEducator ? 'Crie sua primeira turma para começar.' : 'Explore as turmas disponíveis e entre na que procura.' }}</p>
      <button class="button dark" @click="emit('navigate', isEducator ? 'create' : 'catalog')">
        {{ isEducator ? 'Criar turma' : 'Explorar turmas' }}
      </button>
    </div>
  </section>
</template>
