<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  name: { type: String, default: 'Turma' },
  coverUrl: { type: String, default: '' },
  profileUrl: { type: String, default: '' },
  compact: { type: Boolean, default: false }
})

function imageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return ''
  try {
    const url = new URL(value.trim())
    return ['https:', 'http:'].includes(url.protocol) ? url.href : ''
  } catch { return '' }
}
const cover = computed(() => imageUrl(props.coverUrl))
const profile = computed(() => imageUrl(props.profileUrl))
const initial = computed(() => (props.name?.trim()?.charAt(0) || 'T').toLocaleUpperCase('pt-BR'))
const brokenCover = ref(false)
const brokenProfile = ref(false)
watch(cover, () => { brokenCover.value = false })
watch(profile, () => { brokenProfile.value = false })
</script>

<template>
  <div class="class-artwork" :class="{ 'class-artwork--compact': compact }" aria-hidden="true">
    <div class="class-artwork__cover">
      <img v-if="cover && !brokenCover" class="class-artwork__cover-image"
        :src="cover" alt="" loading="lazy" decoding="async" @error="brokenCover = true" />
    </div>
    <div class="class-artwork__avatar">
      <img v-if="profile && !brokenProfile" :src="profile" alt=""
        loading="lazy" decoding="async" @error="brokenProfile = true" />
      <span v-else>{{ initial }}</span>
    </div>
  </div>
</template>
