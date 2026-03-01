import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Task } from 'src/app/models/task';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const categories = JSON.parse(localStorage.getItem('categories') || '[]');
      this.tasksSubject.next(tasks);
      this.categoriesSubject.next(categories);
    } catch {
      this.tasksSubject.next([]);
      this.categoriesSubject.next([]);
    }
  }

  // ── Tasks ──────────────────────────────────────────
  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasksSubject.next([...tasks]);
  }

  addTask(task: Task): void {
    const tasks = [...this.getTasks(), task];
    this.saveTasks(tasks);
  }

  updateTask(updated: Task): void {
    const tasks = this.getTasks().map(t => t.id === updated.id ? updated : t);
    this.saveTasks(tasks);
  }

  deleteTask(id: string): void {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  }

  // ── Categories ─────────────────────────────────────
  getCategories(): Category[] {
    return this.categoriesSubject.getValue();
  }

  addCategory(category: Category): void {
    const categories = [...this.getCategories(), category];
    this.saveCategories(categories);
  }

  saveCategories(categories: Category[]): void {
    localStorage.setItem('categories', JSON.stringify(categories));
    this.categoriesSubject.next([...categories]);
  }

  updateCategory(updated: Category): void {
    const categories = this.getCategories().map(c => c.id === updated.id ? updated : c);
    this.saveCategories(categories);
  }

  deleteCategory(id: string): void {
    const tasks = this.getTasks().map(t =>
      t.categoryId === id ? { ...t, categoryId: undefined } : t
    );
    this.saveTasks(tasks);
    const categories = this.getCategories().filter(c => c.id !== id);
    this.saveCategories(categories);
  }

}
