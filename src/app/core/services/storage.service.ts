import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from 'src/app/models/category';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const categories = JSON.parse(localStorage.getItem('categories') || '[]');
      this.categoriesSubject.next(categories);
    } catch {
      this.categoriesSubject.next([]);
    }
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

}
