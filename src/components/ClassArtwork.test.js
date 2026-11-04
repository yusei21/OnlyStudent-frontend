import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ClassArtwork from './ClassArtwork.vue'

describe('ClassArtwork', () => {
  it('mantém fallback de avatar sem imagens', () => {
    const wrapper = mount(ClassArtwork, { props: { name: 'Matemática' } })
    expect(wrapper.find('.class-artwork__avatar span').text()).toBe('M')
    expect(wrapper.findAll('img')).toHaveLength(0)
  })

  it('usa URLs de capa e perfil independentemente', () => {
    const wrapper = mount(ClassArtwork, {
      props: {
        name: 'Programação',
        coverUrl: 'https://example.com/cover.png',
        profileUrl: 'https://example.com/profile.png'
      }
    })
    expect(wrapper.find('.class-artwork__cover-image').attributes('src')).toBe('https://example.com/cover.png')
    expect(wrapper.find('.class-artwork__avatar img').attributes('src')).toBe('https://example.com/profile.png')
  })

  it('não renderiza URLs inseguras e substitui imagem com erro', async () => {
    const wrapper = mount(ClassArtwork, {
      props: {
        name: 'História',
        coverUrl: 'javascript:alert(1)',
        profileUrl: 'https://example.com/missing.png'
      }
    })
    expect(wrapper.find('.class-artwork__cover-image').exists()).toBe(false)
    await wrapper.find('.class-artwork__avatar img').trigger('error')
    expect(wrapper.find('.class-artwork__avatar span').text()).toBe('H')
  })
})
