import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('i18n', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('loads translations and returns English values by default', async () => {
    const { getCurrentLanguage, loadTranslations, t } = await import('../i18n')

    await expect(loadTranslations()).resolves.toBeUndefined()
    expect(getCurrentLanguage()).toBe('en')
    expect(t('button.add')).toBe('Add Task')
  })

  it('switches languages and falls back to the key for missing translations', async () => {
    const { getCurrentLanguage, setLanguage, t } = await import('../i18n')

    setLanguage('fr')

    expect(getCurrentLanguage()).toBe('fr')
    expect(t('button.delete')).toBe('Supprimer')
    expect(t('missing.key')).toBe('missing.key')
  })
})
