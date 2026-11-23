import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutSection from '../AboutSection.vue'
import { about } from '@/data/site'

describe('AboutSection', () => {
  it('renders the section with its banner, text and video', () => {
    const wrapper = mount(AboutSection)
    const section = wrapper.find('section#about-us')
    expect(section.exists()).toBe(true)
    expect(section.find('.section-banner').text()).toBe(about.title)
    expect(section.text()).toContain(about.heading)

    const video = section.find('video')
    expect(video.attributes('controls')).toBeDefined()
    expect(video.attributes('preload')).toBe('metadata')
    expect(video.attributes('poster')).toBe(about.video.poster)
    expect(video.attributes('loop')).toBeUndefined()
    const sources = video.findAll('source')
    expect(sources).toHaveLength(1)
    // The file is a WebM: the declared type must say so.
    expect(about.video.src).toMatch(/\.webm$/)
    expect(sources[0]!.attributes('type')).toBe('video/webm')
  })
})
