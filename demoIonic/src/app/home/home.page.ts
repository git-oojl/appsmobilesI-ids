import { Task } from './../models/task.model';
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton],
})
export class HomePage {

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
    console.log(this.tasks);
  }

  saludar(){
    console.log("Saludo.")
  }
}
