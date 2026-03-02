import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, TrackByFunction,
  ViewChild
} from '@angular/core';
import { Observable, Subject, takeUntil, combineLatest, map, BehaviorSubject } from 'rxjs';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { Category } from '../../models/category';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonIcon, IonList, IonItemSliding, IonItem, IonCheckbox, IonLabel, IonBadge,
  IonChip, IonFab, IonFabButton, IonCard, IonCardContent, IonItemOptions,
  IonItemOption, IonInput, IonTextarea, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonIcon, IonList, IonItemSliding, IonItem, IonCheckbox, IonLabel, IonBadge,
    IonChip, IonFab, IonFabButton, IonCard, IonCardContent, IonItemOptions,
    IonItemOption, IonInput, IonTextarea, IonSelect, IonSelectOption,
    CommonModule, FormsModule, ReactiveFormsModule, RouterLink
  ]
})
export class TasksPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private filterSubject = new BehaviorSubject<string | null>(null);

  // ── Modal references ───────────────────────────────
  @ViewChild('taskModal') taskModal!: IonModal;
  @ViewChild('deleteModal') deleteModal!: IonModal;

  // ── Modal state ────────────────────────────────────
  modalTitle = 'Nueva Tarea';
  editingTask: Task | null = null;
  taskToDelete: Task | null = null;

  // Form fields (two-way bound in the template)
  formTitle = '';
  formDescription = '';
  formCategoryId: string | null = null;

  // ── Streams ────────────────────────────────────────
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
  ) { }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories$();
    this.enableCategories$ = this.firebaseService.flags$.pipe(map(f => f.enableCategories));
    this.enableTaskStats$ = this.firebaseService.flags$.pipe(map(f => f.enableTaskStats));

    this.tasks$ = combineLatest([
      this.taskService.getTasks$(),
      this.filterSubject,
    ]).pipe(
      map(([tasks, filter]) =>
        filter ? tasks.filter(t => t.categoryId === filter) : tasks
      )
    );

    this.taskService.getTasks$().pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.stats = this.taskService.getStats();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── TrackBy (performance) ──────────────────────────
  trackById: TrackByFunction<Task> = (_, task) => task.id;
  trackByCatId: TrackByFunction<Category> = (_, cat) => cat.id;

  // ── Filter ─────────────────────────────────────────
  setFilter(categoryId: string | null): void {
    this.filterSubject.next(categoryId);
  }

  // ── Open modal: Agregar ────────────────────────────
  openAddModal(): void {
    this.editingTask = null;
    this.modalTitle = 'Nueva Tarea';
    this.formTitle = '';
    this.formDescription = '';
    this.formCategoryId = null;
    this.taskModal.present();
  }

  // ── Open modal: Editar ─────────────────────────────
  openEditModal(task: Task): void {
    this.editingTask = task;
    this.modalTitle = 'Editar Tarea';
    this.formTitle = task.title;
    this.formDescription = task.description ?? '';
    this.formCategoryId = task.categoryId ?? null;
    this.taskModal.present();
  }

  // ── Guardar (crear o actualizar) ───────────────────
  saveTask(): void {
    if (!this.formTitle.trim()) return;

    if (this.editingTask) {
      this.taskService.updateTask(
        this.editingTask,
        this.formTitle,
        this.formDescription || undefined,
        this.formCategoryId ?? undefined,
      );
    } else {
      this.taskService.addTask(
        this.formTitle,
        this.formDescription || undefined,
        this.formCategoryId ?? undefined,
      );
    }

    this.taskModal.dismiss();
  }

  // ── Toggle ─────────────────────────────────────────
  toggleTask(task: Task): void {
    this.taskService.toggleComplete(task);
  }

  // ── Open modal: Confirmar eliminación ─────────────
  openDeleteModal(task: Task): void {
    this.taskToDelete = task;
    this.deleteModal.present();
  }

  confirmDelete(): void {
    if (this.taskToDelete) {
      this.taskService.deleteTask(this.taskToDelete.id);
      this.taskToDelete = null;
    }
    this.deleteModal.dismiss();
  }

  // ── Helper ─────────────────────────────────────────
  getCategoryForTask(task: Task): Category | undefined {
    return task.categoryId ? this.categoryService.getCategoryById(task.categoryId) : undefined;
  }
}
