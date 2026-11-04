<script setup>
import { reactive, ref } from 'vue'
import { request } from '../lib/api.js'
const props=defineProps({session:{type:Object,default:null}})
const emit=defineEmits(['navigate'])
const form=reactive({name:props.session?.name||'',email:props.session?.email||'',phone:'',razao:'',descricao:''})
const loading=ref(false),error=ref(''),notice=ref('')
async function submit(){loading.value=true;error.value='';notice.value='';try{await request('/support/send',{method:'POST',body:{...form},token:props.session?.token});notice.value='Mensagem enviada. Nossa equipe entrará em contato.';form.descricao=''}catch(e){error.value=e.message}finally{loading.value=false}}
</script>
<template><section class="container workspace"><div class="workspace-heading"><div><span class="eyebrow">AJUDA</span><h1>Como podemos ajudar?</h1><p>Envie uma mensagem para a equipe de suporte.</p></div><button class="text-button" @click="emit('navigate',session?'dashboard':'home')">← Voltar</button></div>
<p v-if="error" class="message error" role="alert">{{error}}</p><p v-if="notice" class="message success" role="status">{{notice}}</p>
<form class="form-card create-form" @submit.prevent="submit"><label>Nome<input v-model.trim="form.name" required></label><label>E-mail<input v-model.trim="form.email" type="email" required></label><label>Telefone<input v-model.trim="form.phone" type="tel" required></label><label>Motivo<input v-model.trim="form.razao" required placeholder="Ex.: Dúvida sobre uma turma"></label><label>Descreva sua solicitação<textarea v-model.trim="form.descricao" rows="5" required></textarea></label><button class="button dark" :disabled="loading">{{loading?'Enviando…':'Enviar mensagem'}}</button></form></section></template>