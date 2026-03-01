import { Component, OnInit, OnDestroy, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonCard, IonCardContent, IonChip, IonBadge, IonItemSliding, IonItem, IonCheckbox, IonItemOptions, IonItemOption, IonList, IonLabel, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Task } from 'src/app/models/task';
import { Category } from 'src/app/models/category';
import { AlertController } from '@ionic/angular';
import { TaskService } from 'src/app/core/services/task.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { FirebaseService } from 'src/app/core/services/firebase.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButtons, IonButton, IonIcon, RouterLink, IonCard, IonCardContent, IonChip, IonBadge, IonItemSliding, IonItem, IonCheckbox, IonItemOptions, IonItemOption, IonList, IonLabel, IonFab, IonFabButton]
})
export class TasksPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private filterSubject = new BehaviorSubject<string | null>(null);

  tasks$!: Observable<Task[]>;
  categories$!: Observable<Category[]>;
  enableCategories$!: Observable<boolean>;
  enableTaskStats$!: Observable<boolean>;
  selectedFilter$ = this.filterSubject.asObservable();

  stats = { total: 0, completed: 0, pending: 0 };
  constructor(
    public taskService: TaskService,
    public categoryService: CategoryService,
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackById: TrackByFunction<Task> = (_, task) => task.id;
  trackByCatId: TrackByFunction<Category> = (_, cat) => cat.id;


  async addTask() {
    const categories = this.categoryService.getCategories();
    const catInputs = categories.map(c => ({
      type: 'radio' as const,
      label: c.name,
      value: c.id,
    }));

    const alert = await this.alertCtrl.create({
      header: 'Nueva Tarea',
      inputs: [
        { name: 'title', type: 'text', placeholder: 'Título de la tarea' },
        { name: 'description', type: 'textarea', placeholder: 'Descripción (opcional)' },
        ...catInputs,
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: data => {
            if (data.title?.trim()) {
              const categoryId = catInputs.find(i => i.value === data[0])?.value;
              this.taskService.addTask(data.title, data.description, categoryId);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  toggleTask(task: Task): void {
    this.taskService.toggleComplete(task);
  }

  setFilter(categoryId: string | null) {
    this.filterSubject.next(categoryId);
  }

  async deleteTask(task: Task): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: `¿Eliminar "${task.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.taskService.deleteTask(task.id) },
      ],
    });
    await alert.present();
  }

  getCategoryForTask(task: Task): Category | undefined {
    return task.categoryId ? this.categoryService.getCategoryById(task.categoryId) : undefined;
  }

}
