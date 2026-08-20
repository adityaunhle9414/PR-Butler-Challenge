import { describe, it, expect, beforeEach } from 'vitest'
import { TaskManager } from '../taskManager'

describe('TaskManager', () => {
  let manager: TaskManager

  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = `
      <ul id="tasks"></ul>
      <span id="total-count">0</span>
      <span id="completed-count">0</span>
    `
    manager = new TaskManager()
  })

  it('should add a task', () => {
    manager.addTask('Test task', 'low')
    const tasks = manager.getTasks()

    expect(tasks).toHaveLength(1)
    expect(tasks[0]).toMatchObject({
      text: 'Test task',
      priority: 'low',
      completed: false
    })
    expect(tasks[0].createdAt).toBeInstanceOf(Date)
  })

  it('should get completed count', () => {
    manager.addTask('Task 1', 'low')
    expect(manager.getCompletedCount()).toBe(0)
  })

  it('should toggle a task completion state', () => {
    manager.addTask('Task 1', 'medium')
    const [task] = manager.getTasks()

    manager.toggleTask(task.id)

    expect(manager.getTasks()[0].completed).toBe(true)
    expect(manager.getCompletedCount()).toBe(1)
    expect(document.getElementById('completed-count')?.textContent).toBe('1')
  })

  it('should ignore toggles for unknown task ids', () => {
    manager.addTask('Task 1', 'medium')

    manager.toggleTask(999)

    expect(manager.getTasks()[0].completed).toBe(false)
  })

  it('should delete a task by id', () => {
    manager.addTask('Task 1', 'low')
    manager.addTask('Task 2', 'high')
    const [task] = manager.getTasks()

    manager.deleteTask(task.id)

    expect(manager.getTasks()).toHaveLength(1)
    expect(manager.getTasks()[0].text).toBe('Task 2')
  })

  it('should safely ignore deletion of unknown task ids', () => {
    manager.addTask('Task 1', 'low')

    manager.deleteTask(999)

    expect(manager.getTasks()).toHaveLength(1)
  })

  it('should render all, active, and completed filters', () => {
    manager.addTask('Active task', 'low')
    manager.addTask('Completed task', 'high')
    const completedTask = manager.getTasks()[1]
    manager.toggleTask(completedTask.id)

    manager.setFilter('active')
    expect(document.querySelectorAll('.task-item')).toHaveLength(1)
    expect(document.querySelector('.task-text')?.textContent).toBe('Active task')

    manager.setFilter('completed')
    expect(document.querySelectorAll('.task-item')).toHaveLength(1)
    expect(document.querySelector('.task-text')?.textContent).toBe('Completed task')

    manager.setFilter('all')
    expect(document.querySelectorAll('.task-item')).toHaveLength(2)
  })

  it('should render task content safely and update stats', () => {
    manager.addTask('<img src=x onerror=alert(1)>', 'high')

    expect(document.querySelector('.task-text')?.textContent).toBe('<img src=x onerror=alert(1)>')
    expect(document.querySelector('.task-text img')).toBeNull()
    expect(document.querySelector('.priority-badge')?.textContent).toBe('High Priority')
    expect(document.querySelector('.delete-btn')?.textContent).toBe('Delete')
    expect(document.getElementById('total-count')?.textContent).toBe('1')
  })

  it('should delete a task from the rendered delete button', () => {
    manager.addTask('Task 1', 'low')

    document.querySelector<HTMLButtonElement>('.delete-btn')?.click()

    expect(manager.getTasks()).toHaveLength(0)
    expect(document.querySelectorAll('.task-item')).toHaveLength(0)
  })

  it('should persist tasks to localStorage and load them in a new manager', () => {
    manager.addTask('Stored task', 'medium')
    const storedTask = manager.getTasks()[0]
    storedTask.createdAt = new Date('2026-08-20T00:00:00.000Z')
    localStorage.setItem('tasks', JSON.stringify(manager.getTasks()))

    const restoredManager = new TaskManager()

    expect(restoredManager.getTasks()).toHaveLength(1)
    expect(restoredManager.getTasks()[0]).toMatchObject({
      id: storedTask.id,
      text: 'Stored task',
      priority: 'medium'
    })
    expect(restoredManager.getTasks()[0].createdAt).toBeInstanceOf(Date)

    restoredManager.addTask('Next task', 'low')
    expect(restoredManager.getTasks()[1].id).toBe(storedTask.id + 1)
  })
})
