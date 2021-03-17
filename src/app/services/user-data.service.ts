import { Injectable } from '@angular/core';

const userPokemonsKey = 'user_pokemons';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }



  getUserPokemons(): string[] {
    const userPokemonsStr = localStorage.getItem(userPokemonsKey);
    return userPokemonsStr && JSON.parse(userPokemonsStr) || [];
  }

  saveUserPokemon(pokemon: string): void {
    let pokemons = this.getUserPokemons();
    if (!pokemons) {
      pokemons = [];
    }
    pokemons.push(pokemon);
    localStorage.setItem(userPokemonsKey, JSON.stringify(pokemons));
  }

  removeUserPokemon(pokemon: string): void {
    const pokemons = this.getUserPokemons();
    if (!pokemons) {
      return;
    }
    const pokemonIdx = pokemons.indexOf(pokemon);
    if (pokemonIdx > -1) {
      delete pokemons[pokemonIdx];
      localStorage.setItem(userPokemonsKey, JSON.stringify(pokemons));
    }
  }

  clearUserPokemons(): void {
    localStorage.setItem(userPokemonsKey, JSON.stringify({}));
  }
}
