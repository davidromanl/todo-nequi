import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from 'src/app/models/task';
import { StorageService } from './storage.service';
import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private storage: StorageService) { }

  getTasks$(): Observable<Task[]> {
    return this.storage.tasks$;
  }

  getFilteredTasks$(categoryId: string | null): Observable<Task[]> {
    return this.storage.tasks$;
  }

  addTask(title: string, description?: string, categoryId?: string): void {
    const task: Task = {
      id: uuid(),
      title: title.trim(),
      description,
      completed: false,
      categoryId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.storage.addTask(task);
  }

  toggleComplete(task: Task): void {
    this.storage.updateTask({
      ...task,
      completed: !task.completed,
      updatedAt: Date.now(),
    });
  }

  updateTask(task: Task, title: string, description?: string, categoryId?: string): void {
    this.storage.updateTask({
      ...task,
      title: title.trim(),
      description,
      categoryId,
      updatedAt: Date.now(),
    });
  }

  deleteTask(id: string): void {
    this.storage.deleteTask(id);
  }

  getStats(): { total: number; completed: number; pending: number } {
    const tasks = this.storage.getTasks();
    const completed = tasks.filter(t => t.completed).length;
    return { total: tasks.length, completed, pending: tasks.length - completed };
  }

}
