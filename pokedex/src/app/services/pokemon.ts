import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { PokemonDetail, PokemonListResponse } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private http: HttpClient = inject(HttpClient);
  private readonly URL = 'https://pokeapi.co/api/v2/pokemon';

  getPokemons(limit: number = 5, offset: number = 0) {
    return this.http
      .get<PokemonListResponse>(`${this.URL}?limit=${limit}&offset=${offset}`)
      .pipe(
        map(response => {
          response.results = response.results.map(pokemon => {
            const partes = pokemon.url.split('/').filter(Boolean);
            const id = Number(partes[partes.length - 1]);

            return {
              ...pokemon,
              id
            };
          });

          return response;
        })
      );
  }

  getPokemon(id: number | string) {
    return this.http.get<PokemonDetail>(`${this.URL}/${id}`);
  }
}
