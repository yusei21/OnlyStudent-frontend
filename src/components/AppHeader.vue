<script setup>
import { ref } from 'vue'
import AccessibilityMenu from './AccessibilityMenu.vue'
defineProps({ session:{type:Object,default:null}, view:{type:String,required:true} })
const emit=defineEmits(['navigate','logout']), menuOpen=ref(false)
function go(view){menuOpen.value=false;emit('navigate',view)}
function logout(){menuOpen.value=false;emit('logout')}
</script>
<template>
<header class="topbar"><div class="container topbar-inner">
 <button class="brand" @click="go(session?'dashboard':'home')" aria-label="OnlyStudent, início"><span class="brand-mark">✦</span><span>OnlyStudent</span></button>
 <nav :class="{open:menuOpen}" aria-label="Navegação principal">
 <template v-if="session"><button :class="{active:view==='dashboard'}" @click="go('dashboard')">Minhas turmas</button><button v-if="session.role==='student'" :class="{active:view==='catalog'}" @click="go('catalog')">Explorar</button><button v-if="session.role==='educator'" :class="{active:view==='create'}" @click="go('create')">Nova turma</button><button :class="{active:view==='profile'}" @click="go('profile')">Meu perfil</button><button v-if="session.role==='admin'" :class="{active:view==='admin'}" @click="go('admin')">Administração</button><button :class="{active:view==='support'}" @click="go('support')">Suporte</button><span class="nav-user">{{session.name?.split(' ')[0]||'Conta'}}</span><button @click="logout">Sair</button></template>
 <template v-else><button @click="go('login')">Entrar</button><button class="nav-primary" @click="go('register')">Criar conta</button><button @click="go('support')">Suporte</button></template>
 </nav><div class="header-controls"><AccessibilityMenu/><button class="menu-button" aria-label="Alternar menu" :aria-expanded="menuOpen" @click="menuOpen=!menuOpen">☰</button></div>
</div></header>
</template>