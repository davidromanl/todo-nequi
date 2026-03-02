import { Component, OnInit, TrackByFunction, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonBackButton, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonModal, IonInput } from '@ionic/angular/standalone';
import { Category } from '../../models/category';
import { Observable } from 'rxjs';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton, IonIcon, IonBackButton, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonModal, IonInput]
})
export class CategoriesPage implements OnInit {
  categories$!: Observable<Category[]>;
  colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

  @ViewChild('categoryModal') categoryModal!: IonModal;
  @ViewChild('deleteModal') deleteModal!: IonModal;

  modalTitle = 'Nueva Categoría';
  editingCategory: Category | null = null;
  categoryToDelete: Category | null = null;
  formName = '';
  formColor = '';
  formIcon = '';

  availableIcons = [
    'pricetag-outline', 'star-outline', 'home-outline', 'briefcase-outline',
    'cart-outline', 'fast-food-outline', 'heart-outline', 'fitness-outline',
    'book-outline', 'car-outline', 'airplane-outline', 'wallet-outline',
    'gift-outline', 'musical-notes-outline', 'construct-outline'
  ];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories$();
  }

  trackById: TrackByFunction<Category> = (_, cat) => cat.id;

  addCategory() {
    this.editingCategory = null;
    this.modalTitle = 'Nueva Categoría';
    this.formName = '';
    this.formColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.formIcon = 'pricetag-outline';
    this.categoryModal.present();
  }

  editCategory(cat: Category) {
    this.editingCategory = cat;
    this.modalTitle = 'Editar Categoría';
    this.formName = cat.name;
    this.formColor = cat.color ?? this.colors[Math.floor(Math.random() * this.colors.length)];
    this.formIcon = cat.icon ?? 'pricetag-outline';
    this.categoryModal.present();
  }

  saveCategory() {
    if (!this.formName.trim()) return;

    if (this.editingCategory) {
      this.categoryService.updateCategory(this.editingCategory, this.formName, this.formColor, this.formIcon);
    } else {
      this.categoryService.addCategory(this.formName, this.formColor, this.formIcon);
    }

    this.categoryModal.dismiss();
  }

  deleteCategory(cat: Category): void {
    this.categoryToDelete = cat;
    this.deleteModal.present();
  }

  confirmDelete(): void {
    if (this.categoryToDelete) {
      this.categoryService.deleteCategory(this.categoryToDelete.id);
      this.categoryToDelete = null;
    }
    this.deleteModal.dismiss();
  }
}
