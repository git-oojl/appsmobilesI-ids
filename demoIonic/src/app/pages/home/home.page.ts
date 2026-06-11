import { Task } from './../../models/task.model';
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton, IonItem, IonLabel, IonInput, IonList, IonIcon } from '@ionic/angular/standalone';
import {FormsModule} from '@angular/forms'
import {addIcons} from 'ionicons'
import {addOutline, addCircleOutline} from 'ionicons/icons'


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonIcon, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton, IonInput, FormsModule, IonList],
})
export class HomePage {

  newTaskStr: string = '';

  // Arreglo de tareas
  tasks: Task[] = [{
    id: 1,
    titulo: 'Configuracion de Ionic',
    descripcion: 'Instalar Node.js, Angular CLI y Ionic CLI',
    finalizado: true,
    prioridad: 'Alta',
  },
  {
    id: 2,
    titulo: 'Crear task list',
    descripcion: 'Crear el proyecto inicial de task list',
    finalizado: true,
    prioridad: 'Alta',
  }
];

  constructor() {
    addIcons({addCircleOutline});
    console.log(this.tasks);
  }

  addTask(){
    const titulo = this.newTaskStr.trim();

    if (!titulo) {
      alert('El título no puede estar vacío');
      return;
    }

    const existe = this.tasks.some(task =>
      task.titulo.trim().toLowerCase() === titulo.toLowerCase()
    );

    if (existe) {
      alert('La tarea ya existe');
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      titulo,
      descripcion: '',
      finalizado: false,
      prioridad: 'Media'
    };
    this.tasks.push(newTask);
    this.newTaskStr = ''; // Limpia el input
    console.log(this.tasks);
  }

  saludar(){
    console.log("Saludo.")
  }
}
