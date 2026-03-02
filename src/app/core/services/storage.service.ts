import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Category } from 'src/app/models/category';
import { Task } from 'src/app/models/task';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  async init(): Promise<void> {
    await this.storage.create();
    await this.loadFromStorage();
  }

  private async loadFromStorage(): Promise<void> {
    try {
      const tasks: Task[] = (await this.storage.get('tasks')) ?? [];
      const categories: Category[] = (await this.storage.get('categories')) ?? [];
      this.tasksSubject.next(tasks);
      this.categoriesSubject.next(categories);
    } catch {
      this.tasksSubject.next([]);
      this.categoriesSubject.next([]);
    }
  }

  // Tasks
  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    await this.storage.set('tasks', tasks);
    this.tasksSubject.next([...tasks]);
  }

  async addTask(task: Task): Promise<void> {
    const tasks = [...this.getTasks(), task];
    await this.saveTasks(tasks);
  }

  async updateTask(updated: Task): Promise<void> {
    const tasks = this.getTasks().map(t => (t.id === updated.id ? updated : t));
    await this.saveTasks(tasks);
  }

  async deleteTask(id: string): Promise<void> {
    const tasks = this.getTasks().filter(t => t.id !== id);
    await this.saveTasks(tasks);
  }

  // Categories
  getCategories(): Category[] {
    return this.categoriesSubject.getValue();
  }

  async addCategory(category: Category): Promise<void> {
    const categories = [...this.getCategories(), category];
    await this.saveCategories(categories);
  }

  async saveCategories(categories: Category[]): Promise<void> {
    await this.storage.set('categories', categories);
    this.categoriesSubject.next([...categories]);
  }

  async updateCategory(updated: Category): Promise<void> {
    const categories = this.getCategories().map(c =>
      c.id === updated.id ? updated : c
    );
    await this.saveCategories(categories);
  }

  async deleteCategory(id: string): Promise<void> {
    const tasks = this.getTasks().map(t =>
      t.categoryId === id ? { ...t, categoryId: undefined } : t
    );
    await this.saveTasks(tasks);
    const categories = this.getCategories().filter(c => c.id !== id);
    await this.saveCategories(categories);
  }

}
