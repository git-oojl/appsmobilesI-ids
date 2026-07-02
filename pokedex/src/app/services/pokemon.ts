import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { IPokemon } from '../interfaces/ipokemon';
import { IStats } from '../interfaces/istats';
import { PokemonDetail } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly URL_BASE = 'https://pokeapi.co/api/v2/pokemon';
  private nextUrl: string | null = `${this.URL_BASE}?limit=20&offset=0`;

  getPokemons(): Promise<IPokemon[]> | null {
    if (this.nextUrl === null) {
      return null;
    }

    return (async () => {
      const response: HttpResponse = await CapacitorHttp.get({
        url: this.nextUrl as string,
        params: {},
      });
      const results = (response.data.results as Array<{ url: string }>) ?? [];

      this.nextUrl = response.data.next as string | null;

      const promises = results.map((result) =>
        CapacitorHttp.get({
          url: result.url,
          params: {},
        })
      );
      const pokemonResponses: HttpResponse[] = await Promise.all(promises);

      return pokemonResponses.map((pokemonResponse) =>
        this.processPokemon(pokemonResponse.data)
      );
    })();
  }

  getPokemon(id: number | string): Observable<PokemonDetail> {
    return from(
      CapacitorHttp.get({
        url: `${this.URL_BASE}/${id}`,
        params: {},
      })
    ).pipe(map((response: HttpResponse) => response.data as PokemonDetail));
  }

  private processPokemon(pokemonData: any): IPokemon {
    const visibleAbilities: string[] = pokemonData.abilities
      .filter((ability: any) => !ability.is_hidden)
      .map((ability: any) => ability.ability.name);
    const hiddenAbility = pokemonData.abilities.find(
      (ability: any) => ability.is_hidden
    )?.ability.name as string | undefined;
    const stats: IStats[] = pokemonData.stats.map((stat: any) => ({
      base_stat: stat.base_stat,
      name: stat.stat.name,
    }));

    return {
      id: pokemonData.id,
      name: pokemonData.name,
      type1: pokemonData.types[0].type.name,
      type2: pokemonData.types[1]?.type.name,
      sprite: pokemonData.sprites.front_default ?? '',
      height: (pokemonData.height / 10).toString(),
      weight: (pokemonData.weight / 10).toString(),
      abilities: visibleAbilities,
      hiddenAbility,
      stats,
    };
  }
}
