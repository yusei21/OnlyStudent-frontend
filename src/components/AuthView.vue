<script setup>
import { reactive, ref, computed } from 'vue'
const props = defineProps({ mode: { type:String, required:true }, loading:Boolean, error:{type:String,default:''} })
const emit=defineEmits(['submit','navigate'])
const role=ref('student'), showPassword=ref(false)
const form=reactive({name:'',email:'',telephone:'',password:'',especialidade:''})
const registering=computed(()=>props.mode==='register')
function submit(){ const payload=registering.value ? {...form,role:role.value.toUpperCase()} : {email:form.email,password:form.password};emit('submit',payload) }
</script>
<template>
<section class="auth-wrap container" aria-labelledby="auth-title">
 <div class="auth-intro">
  <span class="eyebrow">ONLYSTUDENT / SEU ESPAÇO DE APRENDIZADO</span>
  <div class="auth-illustration" aria-hidden="true">
   <div class="illustration-toolbar"><span class="illustration-dot"></span> Meu espaço <span>•••</span></div>
   <div class="illustration-icon">✦</div><h2>Aprenda no seu ritmo.</h2><p>Suas turmas, materiais e ideias em um só lugar.</p>
   <div class="illustration-line"><span>▤</span> Minhas turmas <span>↗</span></div><div class="illustration-line"><span>☰</span> Materiais e avisos <span>↗</span></div>
  </div>
  <p class="auth-note">Organização simples, espaço para aprender mais.</p>
 </div>
 <div class="auth-panel"><div class="auth-panel-heading"><span class="auth-mark">✦</span><h1 id="auth-title">{{ registering ? 'Crie seu espaço.' : 'Boas-vindas de volta.' }}</h1><p>{{ registering ? 'Comece gratuitamente e organize sua jornada.' : 'Continue de onde você parou.' }}</p></div>
 <form class="form-card auth-form" @submit.prevent="submit">
  <div v-if="registering" class="role-switch" aria-label="Tipo de conta"><button type="button" :class="{selected:role==='student'}" :aria-pressed="role==='student'" @click="role='student'">Sou estudante</button><button type="button" :class="{selected:role==='educator'}" :aria-pressed="role==='educator'" @click="role='educator'">Sou professor</button></div>
  <label v-if="registering">Nome completo<input v-model.trim="form.name" autocomplete="name" required maxlength="120" placeholder="Como podemos chamar você?"></label>
  <label>E-mail<input v-model.trim="form.email" type="email" autocomplete="email" required placeholder="nome@exemplo.com"></label>
  <label v-if="registering">Telefone<input v-model.trim="form.telephone" autocomplete="tel" type="tel" required placeholder="(00) 00000-0000"></label>
  <label v-if="registering && role==='educator'">Especialidade<input v-model.trim="form.especialidade" required placeholder="Ex.: Matemática"></label>
  <label>Senha<div class="password-field"><input v-model="form.password" :type="showPassword?'text':'password'" :autocomplete="registering?'new-password':'current-password'" minlength="6" required :placeholder="registering?'Mínimo de 6 caracteres':'Digite sua senha'"><button type="button" :aria-label="showPassword?'Ocultar senha':'Mostrar senha'" @click="showPassword=!showPassword">{{showPassword?'Ocultar':'Mostrar'}}</button></div></label>
  <p v-if="error" class="message error" role="alert">{{error}}</p>
  <button class="button dark full auth-submit" :disabled="loading" type="submit">{{loading?'Processando…':registering?'Criar conta →':'Entrar →'}}</button>
  <p class="form-footer">{{registering?'Já tem uma conta?':'Ainda não tem uma conta?'}} <button type="button" @click="emit('navigate',registering?'login':'register')">{{registering?'Entrar':'Criar conta'}}</button></p>
 </form><p class="auth-privacy">Ao continuar, você utiliza o OnlyStudent para organizar seus estudos.</p>
 </div>
</section>
</template>