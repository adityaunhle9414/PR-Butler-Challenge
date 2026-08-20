import { Task, TaskFilter } from './types'
import { t } from './i18n'

export class TaskManager {
  private tasks: Task[] = []
  private filter: TaskFilter = 'all'
  private nextId = 1

  constructor() {
    this.loadFromStorage()
  }

  /** Adds a new task with the selected priority and persists the updated task list. */
  addTask(text: string, priority: 'low' | 'medium' | 'high') {
    const task: Task = {
      id: this.nextId++,
      text,
      priority,
      completed: false,
      createdAt: new Date()
    }
    this.tasks.push(task)
    this.saveToStorage()
    this.render()
  }

  /** Toggles completion for a task by id when the task exists. */
  toggleTask(id: number) {
    const task = this.tasks.find(existingTask => existingTask.id === id)
    if (task) {
      task.completed = !task.completed
      this.saveToStorage()
      this.render()
    }
  }

  /** Deletes a task by id and persists the remaining tasks. */
  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id)
    this.saveToStorage()
    this.render()
  }

  /** Updates the current task filter and re-renders the list. */
  setFilter(filter: TaskFilter) {
    this.filter = filter
    this.render()
  }

  /** Renders the filtered task list and updates task statistics. */
  render() {
    const taskList = document.getElementById('tasks')
    if (!taskList) return

    taskList.innerHTML = ''
    this.getFilteredTasks().forEach(task => taskList.appendChild(this.createTaskElement(task)))

    this.updateStats()
  }

  /** Returns the current task list for tests and read-only UI consumers. */
  getTasks() {
    return this.tasks
  }

  /** Returns the number of completed tasks. */
  getCompletedCount() {
    return this.tasks.filter(task => task.completed).length
  }

  private getFilteredTasks() {
    if (this.filter === 'active') {
      return this.tasks.filter(task => !task.completed)
    }

    if (this.filter === 'completed') {
      return this.tasks.filter(task => task.completed)
    }

    return this.tasks
  }

  private createTaskElement(task: Task) {
    const li = document.createElement('li')
    li.className = `task-item ${task.completed ? 'completed' : ''}`

    const content = document.createElement('div')
    content.className = 'task-content'

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.className = 'task-checkbox'
    checkbox.checked = task.completed
    checkbox.addEventListener('change', () => this.toggleTask(task.id))

    const text = document.createElement('span')
    text.className = 'task-text'
    text.textContent = task.text

    const badge = document.createElement('span')
    badge.className = `priority-badge priority-${task.priority}`
    badge.textContent = t(`priority.${task.priority}`)

    content.appendChild(checkbox)
    content.appendChild(text)
    content.appendChild(badge)

    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'delete-btn'
    deleteBtn.textContent = t('button.delete')
    deleteBtn.addEventListener('click', () => this.deleteTask(task.id))

    li.appendChild(content)
    li.appendChild(deleteBtn)

    return li
  }

  private updateStats() {
    const totalCount = document.getElementById('total-count')
    const completedCount = document.getElementById('completed-count')

    if (totalCount) totalCount.textContent = String(this.tasks.length)
    if (completedCount) {
      completedCount.textContent = String(this.getCompletedCount())
    }
  }

  private saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('tasks')
    if (stored) {
      this.tasks = JSON.parse(stored).map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }))
      this.nextId = Math.max(...this.tasks.map(task => task.id), 0) + 1
    }
  }
}
