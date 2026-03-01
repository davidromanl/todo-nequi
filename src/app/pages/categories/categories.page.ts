import { Component, OnInit, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonBackButton, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from '@ionic/angular/standalone';
import { Category } from '../../models/category';
import { Observable } from 'rxjs';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton, IonIcon, IonBackButton, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption]
})
export class CategoriesPage implements OnInit {
  categories$!: Observable<Category[]>;
  colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];

  constructor(private alertCtrl: AlertController, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories$();
  }

  trackById: TrackByFunction<Category> = (_, cat) => cat.id;

  async addCategory() {
    await this.openCategoryDialog();
  }

  async editCategory(cat: Category) {
    await this.openCategoryDialog(cat);
  }

  async deleteCategory(cat: Category): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar categoría',
      message: `¿Eliminar "${cat.name}"? Las tareas asociadas perderán esta categoría.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.categoryService.deleteCategory(cat.id),
        },
      ],
    });
    await alert.present();
  }


  private async openCategoryDialog(existing?: Category): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: "Categoria",
      inputs: [{
        name: 'name',
        type: 'text',
        placeholder: 'Nombre de la categoría',
        value: existing?.name ?? '',
      }],
      buttons: [{ text: 'Cancelar', role: 'cancel' },
      {
        text: existing ? 'Guardar' : 'Crear',
        handler: data => {
          if (!data.name?.trim()) return false;
          const color = existing?.color ?? this.colors[Math.floor(Math.random() * this.colors.length)];
          if (existing) {
            this.categoryService.updateCategory(existing, data.name, color);
          } else {
            this.categoryService.addCategory(data.name, color);
          }
          return true;
        },
      }
      ],
    });
    await alert.present();
  }

}
