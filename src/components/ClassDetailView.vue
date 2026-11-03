<script setup>
import { reactive, ref } from 'vue'
const props = defineProps({
  classroom: { type: Object, required: true },
  isEducator: Boolean,
  loading: Boolean,
  error: { type: String, default: '' },
  notice: { type: String, default: '' }
})
const emit = defineEmits(['navigate', 'add-material', 'delete-material', 'add-notice', 'delete-notice', 'update-class', 'schedule-deletion', 'cancel-deletion', 'update-status'])
const material = reactive({ name: '', tipo: 'LINK', url: '', descricao: '' })
const mensagem = ref('')
const edit = reactive({ name: '', description: '', coverImageUrl: '', profileImageUrl: '' })
const editing = ref(false)
function openEdit() {
  Object.assign(edit, { name: props.classroom.name, description: props.classroom.description || '', coverImageUrl: props.classroom.coverImageUrl || '', profileImageUrl: props.classroom.profileImageUrl || '' })
  editing.value = true
}
function submitMaterial() {
  emit('add-material', { ...material })
  Object.assign(material, { name: '', tipo: 'LINK', url: '', descricao: '' })
}
function submitNotice() {
  if (!mensagem.value.trim()) return
  emit('add-notice', mensagem.value.trim())
  mensagem.value = ''
}
function submitEdit() {
  emit('update-class', { ...edit })
  editing.value = false
}
</script>
<template>
  <section class="container workspace">
    <div class="workspace-heading"><div><span class="eyebrow">TURMA #{{ classroom.codigo }}</span><h1>{{ classroom.name }}</h1></div><button class="text-button" @click="emit('navigate', 'dashboard')">← Minhas turmas</button></div>
    <p v-if="error" class="message error" role="alert">{{ error }}</p>
    <p v-if="notice" class="message success" role="status">{{ notice }}</p>
    <div class="class-detail">
      <img v-if="classroom.coverImageUrl" :src="classroom.coverImageUrl" alt="Capa da turma" style="width:100%;max-height:260px;object-fit:cover;border-radius:14px">
      <img v-if="classroom.profileImageUrl" :src="classroom.profileImageUrl" alt="Imagem de perfil da turma" style="width:80px;height:80px;object-fit:cover;border-radius:50%">
      <p>{{ classroom.description }}</p>
      <div class="detail-info"><div><small>PROFESSOR</small><strong>{{ classroom.educator }}</strong></div><div><small>ALUNOS</small><strong>{{ classroom.nomeAlunos?.length || 0 }}</strong></div><div><small>MATERIAIS</small><strong>{{ classroom.materiais?.length || 0 }}</strong></div></div>
      <p v-if="classroom.dataExclusaoAgendada" class="message error">Exclusão agendada para {{ new Date(classroom.dataExclusaoAgendada).toLocaleString('pt-BR') }}.</p>
      <template v-if="isEducator">
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin:16px 0">
          <button class="button outline" :disabled="loading" @click="openEdit">Editar turma</button>
          <button v-if="classroom.dataExclusaoAgendada" class="button outline" :disabled="loading" @click="emit('cancel-deletion')">Cancelar exclusão</button>
          <button v-else class="button outline" :disabled="loading" @click="emit('schedule-deletion')">Agendar exclusão</button>
        </div>
        <form v-if="editing" class="form-card" @submit.prevent="submitEdit">
          <label>Nome<input v-model.trim="edit.name" maxlength="100" required></label>
          <label>Descrição<textarea v-model.trim="edit.description" rows="3"></textarea></label>
          <label>URL da capa<input v-model.trim="edit.coverImageUrl" type="url"></label>
          <label>URL do perfil<input v-model.trim="edit.profileImageUrl" type="url"></label>
          <button class="button dark" :disabled="loading">Salvar alterações</button>
          <button type="button" class="text-button" @click="editing = false">Cancelar</button>
        </form>
        <label>Status da turma
          <select :disabled="loading" @change="emit('update-status', $event.target.value)">
            <option value="" selected disabled>Alterar status</option>
            <option value="ATIVA">Ativa</option><option value="BLOQUEADA">Bloqueada</option><option value="DESATIVADA">Desativada</option>
          </select>
        </label>
      </template>
      <p class="section-label">MATERIAIS</p>
      <div v-if="classroom.materiais?.length" class="material-list">
        <div v-for="item in classroom.materiais" :key="item.id" style="display:flex;align-items:center;gap:10px">
          <a :href="item.url" target="_blank" rel="noopener noreferrer" style="flex:1"><span>{{ item.tipo }}</span><strong>{{ item.name }}</strong><span>↗</span></a>
          <button v-if="isEducator" type="button" class="text-button" :disabled="loading" @click="emit('delete-material', item.id)">Remover</button>
        </div>
      </div>
      <p v-else class="empty">O professor ainda não adicionou materiais.</p>
      <form v-if="isEducator" class="form-card" @submit.prevent="submitMaterial">
        <h2>Adicionar material</h2>
        <label>Nome<input v-model.trim="material.name" required maxlength="255"></label>
        <label>Tipo<select v-model="material.tipo"><option value="LINK">Link</option><option value="VIDEO">Vídeo</option><option value="PDF">PDF</option></select></label>
        <label>URL<input v-model.trim="material.url" type="url" required></label>
        <label>Descrição<input v-model.trim="material.descricao" maxlength="500"></label>
        <button class="button dark" :disabled="loading">Adicionar material</button>
      </form>
      <p class="section-label">AVISOS</p>
      <div v-if="classroom.avisos?.length" class="catalog-list">
        <div v-for="aviso in classroom.avisos" :key="aviso.id" class="catalog-row">
          <div><p>{{ aviso.mensagem }}</p><small>{{ new Date(aviso.dataCriacao).toLocaleString('pt-BR') }}</small></div>
          <button v-if="isEducator" class="text-button" :disabled="loading" @click="emit('delete-notice', aviso.id)">Excluir</button>
        </div>
      </div>
      <p v-else class="empty">Nenhum aviso publicado.</p>
      <form v-if="isEducator" class="form-card" @submit.prevent="submitNotice">
        <label>Publicar aviso<textarea v-model.trim="mensagem" rows="3" required placeholder="Mensagem para os alunos"></textarea></label>
        <button class="button dark" :disabled="loading">Publicar aviso</button>
      </form>
    </div>
  </section>
</template>