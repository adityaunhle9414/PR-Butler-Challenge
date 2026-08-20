import { beforeEach, describe, expect, it, vi } from 'vitest'

function setupDom() {
  document.body.innerHTML = `
    <div class="container">
      <header>
        <h1 data-i18n="app.title">My Task Manager</h1>
        <div class="language-selector">
          <button id="lang-en" class="active">English</button>
          <button id="lang-fr">Français</button>
        </div>
      </header>
      <main>
        <section class="add-task">
          <h2 data-i18n="task.add">Add New Task</h2>
          <form id="task-form">
            <input type="text" id="task-input" placeholder="Enter task description" data-i18n-placeholder="task.placeholder" required>
            <select id="priority-select">
              <option value="low" data-i18n="priority.low">Low Priority</option>
              <option value="medium" data-i18n="priority.medium">Medium Priority</option>
              <option value="high" data-i18n="priority.high">High Priority</option>
            </select>
            <button type="submit" data-i18n="button.add">Add Task</button>
          </form>
        </section>
        <section class="task-list">
          <h2>Your Tasks</h2>
          <div class="filter-buttons">
            <button class="filter-btn active" data-filter="all" data-i18n="filter.all">All Tasks</button>
            <button class="filter-btn" data-filter="active" data-i18n="filter.active">Active</button>
            <button class="filter-btn" data-filter="completed" data-i18n="filter.completed">Completed</button>
          </div>
          <ul id="tasks"></ul>
          <div class="stats">
            <p><span data-i18n="stats.total">Total tasks</span>: <span id="total-count">0</span></p>
            <p><span data-i18n="stats.completed">Completed</span>: <span id="completed-count">0</span></p>
          </div>
        </section>
      </main>
      <footer>
        <p><span data-i18n="footer.text">Built with TypeScript</span> • 2026</p>
      </footer>
    </div>
  `
}

async function loadApp() {
  await import('../main')
  await Promise.resolve()
}

describe('main app wiring', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
    localStorage.clear()
    setupDom()
  })

  it('applies English translations on startup', async () => {
    await loadApp()

    expect(document.title).toBe('My Task Manager')
    expect(document.querySelector('h1')?.textContent).toBe('My Task Manager')
    expect(document.querySelector<HTMLInputElement>('#task-input')?.placeholder).toBe('Enter task description')
  })

  it('adds tasks from the form and updates filter controls', async () => {
    await loadApp()

    const input = document.getElementById('task-input') as HTMLInputElement
    const select = document.getElementById('priority-select') as HTMLSelectElement
    const form = document.getElementById('task-form') as HTMLFormElement

    input.value = 'Active task'
    select.value = 'high'
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    input.value = 'Completed task'
    select.value = 'low'
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    document.querySelector<HTMLInputElement>('.task-checkbox')?.click()

    expect(document.querySelectorAll('.task-item')).toHaveLength(2)
    expect(document.getElementById('total-count')?.textContent).toBe('2')
    expect(document.getElementById('completed-count')?.textContent).toBe('1')

    document.querySelector<HTMLButtonElement>('[data-filter="active"]')?.click()
    expect(document.querySelectorAll('.task-item')).toHaveLength(1)
    expect(document.querySelector('.task-text')?.textContent).toBe('Completed task')

    document.querySelector<HTMLButtonElement>('[data-filter="completed"]')?.click()
    expect(document.querySelectorAll('.task-item')).toHaveLength(1)
    expect(document.querySelector('.task-text')?.textContent).toBe('Active task')
  })

  it('switches static and dynamic UI text to French', async () => {
    await loadApp()

    const input = document.getElementById('task-input') as HTMLInputElement
    const select = document.getElementById('priority-select') as HTMLSelectElement
    const form = document.getElementById('task-form') as HTMLFormElement

    input.value = 'Tache traduite'
    select.value = 'high'
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    document.getElementById('lang-fr')?.click()

    expect(document.title).toBe('Mon Gestionnaire de Tâches')
    expect(document.querySelector('h1')?.textContent).toBe('Mon Gestionnaire de Tâches')
    expect(input.placeholder).toBe('Saisir la description de la tâche')
    expect(document.querySelector('[data-filter="all"]')?.textContent).toBe('Toutes les tâches')
    expect(document.querySelector('.priority-badge')?.textContent).toBe('Priorité élevée')
    expect(document.querySelector('.delete-btn')?.textContent).toBe('Supprimer')
  })

  it('logs initialization failures', async () => {
    document.body.innerHTML = ''
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const querySpy = vi.spyOn(document, 'querySelectorAll').mockImplementation(() => {
      throw new Error('DOM unavailable')
    })

    await loadApp()
    await Promise.resolve()

    expect(errorSpy).toHaveBeenCalledWith('Failed to initialize app', expect.any(Error))
    querySpy.mockRestore()
  })
})
