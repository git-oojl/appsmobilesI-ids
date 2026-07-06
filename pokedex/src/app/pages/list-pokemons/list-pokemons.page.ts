import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  InfiniteScrollCustomEvent,
  LoadingController,
} from '@ionic/angular/standalone';

import { IPokemon } from '../../interfaces/ipokemon';
import { PokemonService } from '../../services/pokemon';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  imports: [
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonChip,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonImg,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRow,
    IonSearchbar,
    IonTitle,
    IonToolbar,
  ],
})
export class ListPokemonsPage implements OnInit {
  public pokemons: IPokemon[] = [];
  public loading: boolean = false;
  public searchId: string = '';

  private pokemonService: PokemonService = inject(PokemonService);
  private router: Router = inject(Router);
  private loadingController: LoadingController = inject(LoadingController);

  ngOnInit() {
    this.getMorePokemons();
  }

  async getMorePokemons(event?: InfiniteScrollCustomEvent) {
    const promisePokemons = this.pokemonService.getPokemons();

    if (!promisePokemons) {
      this.loading = false;

      if (event) {
        event.target.disabled = true;
        event.target.complete();
      }

      return;
    }

    let loading: HTMLIonLoadingElement | undefined;

    if (!event) {
      loading = await this.loadingController.create({
        message: 'Cargando...',
      });

      await loading.present();
    }

    this.loading = true;

    try {
      const pokemons = await promisePokemons;
      this.pokemons = this.pokemons.concat(pokemons);
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
      await loading?.dismiss();
      event?.target.complete();
    }
  }

  goToPage(pokemon: IPokemon) {
    this.router.navigate(['/detail-pokemon', pokemon.id]);
  }

  onSearchChange(event: CustomEvent<{ value?: string | null }>) {
    this.searchId = event.detail.value ?? '';
  }

  searchById() {
    const id = Number(this.searchId);

    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    this.router.navigate(['/detail-pokemon', id]);
  }

  formatName(name: string) {
    return name
      .split('-')
      .join(' ')
      .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
  }

  trackPokemon(index: number, pokemon: IPokemon) {
    return `${pokemon.id}-${index}`;
  }

  trackType(index: number, type: string) {
    return `${type}-${index}`;
  }

  getTypes(pokemon: IPokemon): string[] {
    return pokemon.type2 ? [pokemon.type1, pokemon.type2] : [pokemon.type1];
  }

  hasSprite(pokemon: IPokemon) {
    return pokemon.sprite.trim().length > 0;
  }
}
