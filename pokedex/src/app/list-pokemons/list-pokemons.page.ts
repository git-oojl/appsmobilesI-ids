import { Component, inject, OnInit } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';

import { PokemonService } from '../services/pokemon';
import { PokemonListItem } from '../models/pokemon.model';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonSearchbar,
    IonSpinner,
    IonTitle,
    IonToolbar
  ],
})
export class ListPokemonsPage implements OnInit {
  public pokemons: PokemonListItem[] = [];
  public loading: boolean = false;
  public limit: number = 20;
  public offset: number = 0;
  public searchId: string = '';

  private pokemonService: PokemonService = inject(PokemonService);
  private router: Router = inject(Router);

  constructor() {
    addIcons({
      chevronForwardOutline
    });
  }

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.loading = true;

    this.pokemonService.getPokemons(this.limit, this.offset).subscribe({
      next: response => {
        this.pokemons = response.results;
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.loading = false;
      }
    });
  }

  nextPage() {
    this.offset += this.limit;
    this.loadPokemons();
  }

  previousPage() {
    if (this.offset === 0) {
      return;
    }

    this.offset -= this.limit;
    this.loadPokemons();
  }

  goToDetail(pokemon: PokemonListItem) {
    this.router.navigate(['/detail-pokemon', pokemon.id]);
  }

  onSearchChange(event: any) {
    this.searchId = event.detail.value || '';
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
}
