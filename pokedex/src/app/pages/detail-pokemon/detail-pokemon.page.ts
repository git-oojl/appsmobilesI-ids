import { Component, inject, Input, numberAttribute } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonProgressBar,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

import { IPokemon } from '../../interfaces/ipokemon';
import { PokemonService } from '../../services/pokemon';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  imports: [
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonChip,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton,
    IonGrid,
    IonHeader,
    IonIcon,
    IonImg,
    IonProgressBar,
    IonRow,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class DetailPokemonPage {
  @Input({ transform: numberAttribute }) id!: number;

  public pokemon?: IPokemon;

  private router: Router = inject(Router);
  private pokemonService: PokemonService = inject(PokemonService);
  private loadingController: LoadingController = inject(LoadingController);

  constructor() {
    addIcons({ closeOutline });
  }

  async ionViewWillEnter() {
    if (!Number.isInteger(this.id) || this.id <= 0) {
      this.goBack();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });

    await loading.present();

    this.pokemonService
      .getPokemon(this.id)
      .then((pokemon: IPokemon) => {
        this.pokemon = pokemon;
      })
      .catch((error) => {
        console.log(error);
        this.goBack();
      })
      .finally(() => loading.dismiss());
  }

  formatName(name: string) {
    return name
      .split('-')
      .join(' ')
      .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
  }

  getTypes(pokemon: IPokemon): string[] {
    return pokemon.type2 ? [pokemon.type1, pokemon.type2] : [pokemon.type1];
  }

  getStatColor(value: number): 'success' | 'warning' | 'danger' {
    return value >= 60 ? 'success' : value <= 30 ? 'danger' : 'warning';
  }

  goBack() {
    this.router.navigateByUrl('/list-pokemons');
  }
}
