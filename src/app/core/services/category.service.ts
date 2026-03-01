import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { Category } from '../../models/category';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private storage: StorageService) { }

  getCategories$(): Observable<Category[]> {
    return this.storage.categories$;
  }

  addCategory(name: string, color: string): void {
    const category: Category = {
      id: uuid(),
      name: name.trim(),
      color,
      createdAt: Date.now(),
    };
    this.storage.addCategory(category);
  }

  updateCategory(category: Category, name: string, color: string): void {
    this.storage.updateCategory({ ...category, name: name.trim(), color });
  }

}
