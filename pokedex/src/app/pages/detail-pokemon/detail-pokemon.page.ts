import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonBackButton,
  IonProgressBar,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { PokemonService } from '../../services/pokemon';
import { PokemonDetail } from '../../models/pokemon.model';

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
    IonContent,
    IonHeader,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonSpinner,
    IonTitle,
    IonToolbar,
    IonProgressBar,
  ],
})
export class DetailPokemonPage implements OnInit {
  public pokemon?: PokemonDetail;
  public loading: boolean = false;

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private pokemonService: PokemonService = inject(PokemonService);

  formatName(name: string) {
    return name
      .split('-')
      .join(' ')
      .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
  }

  getHeight() {
    if (!this.pokemon) {
      return '';
    }

    return `${this.pokemon.height / 10} m`;
  }

  getWeight() {
    if (!this.pokemon) {
      return '';
    }

    return `${this.pokemon.weight / 10} kg`;
  }

  getStatName(name: string) {
    const names: { [key: string]: string } = {
      hp: 'HP',
      attack: 'Attack',
      defense: 'Defense',
      'special-attack': 'Special Attack',
      'special-defense': 'Special Defense',
      speed: 'Speed',
    };

    return names[name] || this.formatName(name);
  }

  getStatPercent(value: number) {
    return value / 255;
  }

  getLevelUpMoves() {
    if (!this.pokemon) {
      return [];
    }

    return this.pokemon.moves
      .map((item) => {
        const detail = item.version_group_details.find(
          (version) => version.move_learn_method.name === 'level-up'
        );

        return {
          name: item.move.name,
          level: detail?.level_learned_at ?? 0,
        };
      })
      .filter((move) => move.level > 0)
      .sort((a, b) => a.level - b.level)
      .slice(0, 8);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/list-pokemons']);
      return;
    }

    this.loading = true;

    this.pokemonService.getPokemon(id).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
        this.router.navigate(['/list-pokemons']);
      },
    });
  }

  getImage() {
    return this.pokemon?.sprites.front_default || '';
  }

  getLocalImage(id: number) {
    return `assets/pokemon/${id}.png`;
  }
}
