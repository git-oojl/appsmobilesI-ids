import { IStats } from './istats';

export interface IPokemon {
  id: number;
  name: string;
  type1: string;
  type2?: string;
  sprite: string;
  height: string;
  weight: string;
  abilities: string[];
  hiddenAbility?: string;
  stats: IStats[];
}
