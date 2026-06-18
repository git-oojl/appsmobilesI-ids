import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonReorder,
  IonReorderGroup,
  IonTitle,
  IonToolbar,
  ReorderEndCustomEvent
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  addOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  ellipseOutline,
  listOutline,
  trashOutline
} from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';
import { AlertService } from '../../alert.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonReorder,
    IonReorderGroup,
    IonTitle,
    IonToolbar,
    FormsModule
  ],
})
export class HomePage {
  public task: string = '';
  public tasks: Task[] = [];
  private readonly KEY_TASK = 'local key task';

  public alertService: AlertService = inject(AlertService);

  constructor() {
    addIcons({
      addOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
      ellipseOutline,
      listOutline,
      trashOutline
    });
  }

  async ionViewWillEnter() {
    const taskPreferences = await Preferences.get({ key: this.KEY_TASK });

    if (taskPreferences.value) {
      const tasks = JSON.parse(taskPreferences.value);
      if (Array.isArray(tasks)) {
        this.tasks = tasks.map((task, index) => this.getTaskFromLocal(task, index));
        this.saveTaskOnLocal();
      }
    }
  }

  addTask() {
    const title = this.cleanTask(this.task);

    if (!title) {
      this.alertService.showAlert('Aviso', 'Ingresa una tarea primero');
      return;
    }

    if (this.tasks.some(task => task.titulo.toLowerCase() === title.toLowerCase())) {
      this.alertService.showAlert('Aviso', 'Esa tarea ya existe');
      return;
    }

    this.tasks.push({
      id: Date.now(),
      titulo: title,
      descripcion: '',
      finalizado: false
    });

    console.log(this.tasks);
    this.alertService.showAlert('Exito', 'Tarea agregada');
    this.task = '';
    this.saveTaskOnLocal();
  }

  toggleTask(taskUpdate: Task) {
    taskUpdate.finalizado = !taskUpdate.finalizado;
    this.saveTaskOnLocal();
  }

  confirmDelete(task: Task) {
    console.log(`Confirmacion para borrar task: ${task.titulo}`);
    this.alertService.confirmAlert(
      'Aviso',
      `Desea borrar la tarea ${task.titulo}?`,
      () => this.deleteTask(task),
      'NO',
      'SI'
    );
  }

  actualizarPosiciones(event: ReorderEndCustomEvent) {
    console.log('El arreglo antes del cambio:', this.tasks);
    this.tasks = event.detail.complete(this.tasks);
    console.log('El arreglo despues del cambio:', this.tasks);
    this.saveTaskOnLocal();
  }

  private deleteTask(taskRemove: Task) {
    this.tasks = this.tasks.filter(task => task.id !== taskRemove.id);
    this.saveTaskOnLocal();
  }

  private cleanTask(task: string) {
    return task.trim().replace(/\s+/g, ' ');
  }

  private getTaskFromLocal(task: string | Task, index: number): Task {
    if (typeof task === 'string') {
      return {
        id: Date.now() + index,
        titulo: task,
        descripcion: '',
        finalizado: false
      };
    }

    return task;
  }

  private saveTaskOnLocal() {
    Preferences.set({
      key: this.KEY_TASK,
      value: JSON.stringify(this.tasks)
    });
  }
}
