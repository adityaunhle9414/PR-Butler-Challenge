import { TaskManager } from './taskManager'
import { loadTranslations, setLanguage, t } from './i18n'
import { TaskFilter } from './types'
import './styles.css'

let taskManager: TaskManager

/** Initializes translations, task state, event handlers, and initial UI rendering. */
async function init() {
  await loadTranslations()
  taskManager = new TaskManager()
  setupEventListeners()
  applyTranslations()
  taskManager.render()
}

/** Wires form submission, language switching, and task filter controls. */
function setupEventListeners() {
  const form = document.getElementById('task-form') as HTMLFormElement
  const langEnBtn = document.getElementById('lang-en')
  const langFrBtn = document.getElementById('lang-fr')

  form?.addEventListener('submit', handleSubmit)
  langEnBtn?.addEventListener('click', () => switchLanguage('en'))
  langFrBtn?.addEventListener('click', () => switchLanguage('fr'))

  const filterBtns = document.querySelectorAll('.filter-btn')
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const filter = target.dataset.filter
      if (filter) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
        target.classList.add('active')
        taskManager.setFilter(filter as TaskFilter)
      }
    })
  })
}

/** Adds a task from the form input and clears the input after successful submission. */
function handleSubmit(e: Event) {
  e.preventDefault()
  const input = document.getElementById('task-input') as HTMLInputElement
  const select = document.getElementById('priority-select') as HTMLSelectElement

  if (input.value.trim()) {
    taskManager.addTask(input.value, select.value as 'low' | 'medium' | 'high')
    input.value = ''
  }
}

/** Switches the active language and refreshes translated UI content. */
function switchLanguage(lang: string) {
  setLanguage(lang)

  document.querySelectorAll('.language-selector button').forEach(btn => {
    btn.classList.remove('active')
  })

  const activeBtn = document.getElementById(`lang-${lang}`)
  activeBtn?.classList.add('active')

  applyTranslations()
  taskManager.render()
}

/** Applies translations to static text and placeholder elements. */
function applyTranslations() {
  document.title = t('app.title')

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n
    if (key) element.textContent = t(key)
  })

  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach(element => {
    const key = element.dataset.i18nPlaceholder
    if (key) element.placeholder = t(key)
  })
}

init().catch(error => {
  console.error('Failed to initialize app', error)
})
