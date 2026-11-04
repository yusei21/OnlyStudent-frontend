<script setup>
import { ref, reactive, onMounted } from 'vue'
import { request } from '../lib/api.js'
const props=defineProps({session:{type:Object,required:true}})
const emit=defineEmits(['navigate'])
const form=reactive({name:'',telephone:'',login:'',especialidade:'',password:''})
const loading=ref(false),saving=ref(false),error=ref(''),notice=ref('')
const endpoint=props.session.role==='educator'?'educator':'student'
async function load(){loading.value=true;error.value='';try{const data=await request('/'+endpoint+'/profile',{token:props.session.token});form.name=data.name||'';form.telephone=data.telephone||data.telefone||'';form.login=data.login||props.session.email||'';form.especialidade=data.especialidade||''}catch(e){error.value=e.message}finally{loading.value=false}}
async function save(){saving.value=true;notice.value='';error.value='';try{const data={...form};if(!data.password)delete data.password;await request('/'+endpoint+'/profile',{method:'PUT',token:props.session.token,body:data});notice.value='Perfil atualizado com sucesso.'}catch(e){error.value=e.message}finally{saving.value=false}}
onMounted(load)
</script>
<template><section class="container workspace"><div class="workspace-heading"><div><span class="eyebrow">CONFIGURAÇÕES</span><h1>Meu perfil</h1><p>Mantenha seus dados atualizados.</p></div><button class="text-button" @click="emit('navigate','dashboard')">← Minhas turmas</button></div>
<p v-if="error" class="message error" role="alert">{{error}}</p><p v-if="notice" class="message success" role="status">{{notice}}</p>
<form class="form-card create-form" @submit.prevent="save"><p v-if="loading">Carregando perfil…</p><template v-else><label>Nome<input v-model.trim="form.name" required autocomplete="name"></label><label>E-mail<input v-model.trim="form.login" type="email" autocomplete="email" required></label><label>Telefone<input v-model.trim="form.telephone" type="tel" autocomplete="tel" required></label><label v-if="session.role==='educator'">Especialidade<input v-model.trim="form.especialidade"></label><label>Nova senha (opcional)<input v-model="form.password" type="password" autocomplete="new-password" minlength="6" placeholder="Deixe em branco para manter a atual"></label><button type="submit" class="button dark" :disabled="saving">{{saving?'Salvando…':'Salvar alterações'}}</button></template></form></section></template>