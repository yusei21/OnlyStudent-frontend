<script setup>
import { onMounted, reactive, ref } from 'vue'
import { request } from '../lib/api.js'
const props=defineProps({session:{type:Object,required:true}})
const emit=defineEmits(['navigate'])
const users=ref([]),loading=ref(false),error=ref(''),notice=ref(''),editing=ref(null)
const form=reactive({name:'',email:'',telephone:'',password:''})
const api=(path,options={})=>request(path,{...options,token:props.session.token})
async function load(){loading.value=true;error.value='';try{users.value=await api('/admin')}catch(e){error.value=e.message}finally{loading.value=false}}
function start(item){editing.value=item?.id??'new';Object.assign(form,{name:item?.name||'',email:item?.email||'',telephone:item?.telephone||item?.telefone||'',password:''})}
async function save(){loading.value=true;error.value='';notice.value='';try{const creating=editing.value==='new';const body={...form};if(!creating&&!body.password)delete body.password;await api(creating?'/admin':`/admin/${editing.value}`,{method:creating?'POST':'PUT',body});editing.value=null;notice.value='Administrador salvo.';await load()}catch(e){error.value=e.message}finally{loading.value=false}}
async function remove(item){if(!window.confirm(`Excluir administrador ${item.name}?`))return;loading.value=true;error.value='';try{await api(`/admin/${item.id}`,{method:'DELETE'});notice.value='Administrador excluído.';await load()}catch(e){error.value=e.message}finally{loading.value=false}}
onMounted(load)
</script>
<template><section class="container workspace"><div class="workspace-heading"><div><span class="eyebrow">ÁREA ADMINISTRATIVA</span><h1>Administradores</h1><p>Gerencie contas administrativas.</p></div><button class="button dark" @click="start(null)">+ Novo administrador</button></div><p v-if="error" class="message error" role="alert">{{error}}</p><p v-if="notice" class="message success" role="status">{{notice}}</p>
<form v-if="editing!==null" class="form-card create-form" @submit.prevent="save"><h2>{{editing==='new'?'Novo administrador':'Editar administrador'}}</h2><label>Nome<input v-model.trim="form.name" required></label><label>E-mail<input v-model.trim="form.email" type="email" required></label><label>Telefone<input v-model.trim="form.telephone" required></label><label>Senha<input v-model="form.password" type="password" :required="editing==='new'" minlength="6" :placeholder="editing==='new'?'Mínimo de 6 caracteres':'Deixe em branco para manter'"></label><div class="actions"><button class="button dark" :disabled="loading">Salvar</button><button type="button" class="button outline" @click="editing=null">Cancelar</button></div></form>
<p v-if="loading" class="empty">Carregando…</p><div v-else class="catalog-list"><div v-for="item in users" :key="item.id" class="catalog-row"><span class="class-icon">✦</span><div><strong>{{item.name}}</strong><small>{{item.email}}</small></div><button class="button outline" @click="start(item)">Editar</button><button class="text-button destructive" @click="remove(item)">Excluir</button></div><p v-if="!users.length" class="empty">Nenhum administrador cadastrado.</p></div></section></template>