import { Component, OnInit } from '@angular/core';
import {PokemonDetail, PokemonDetails, PokemonService, PokemonTypes} from '../../services/pokemon.service';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {UserDataService} from '../../services/user-data.service';

@Component({
  selector: 'app-pokemon-searcher',
  templateUrl: './pokemon-searcher.component.html',
  styleUrls: ['./pokemon-searcher.component.css']
})
export class PokemonSearcherComponent implements OnInit {
  pokemonToTM = [];
  tmNames;
  pokemonTMs: string[];
  pokemonSelected: string;
  pokemonNames: string[];
  filteredPokemonNames: Observable<string[]>;
  pokemonSearchControl = new FormControl();
  typesGraph: any;
  private pokemons: PokemonDetails;
  userPokemons: string[];

  constructor(private pokemonService: PokemonService,
              private userDataService: UserDataService) {
    pokemonService.getTmNames((res) => {
      this.tmNames = res;
    });
    pokemonService.getTmDataByPokemon((res) => {
      this.pokemonToTM = res;
    });
    this.typesGraph = pokemonService.getEffectiveGraph();
    pokemonService.getPokemonsDetails((pokemons) => {
      this.pokemons = pokemons;
      this.pokemonNames = Object.keys(pokemons);
    });
    this.userPokemons = this.userDataService.getUserPokemons();
  }

  ngOnInit(): void {
    this.filteredPokemonNames = this.pokemonSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.pokemonSearchControl.valueChanges.subscribe((p) => {
      if (this.pokemonToTM[p && p.toLowerCase()]) {
        this.updatePokemonTms(p);
      } else {
        this.pokemonTMs = [];
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.pokemonNames?.filter(option => option.toLowerCase().includes(filterValue)) || [];
  }

  updatePokemonTms(pokemon: string): any {
    this.pokemonTMs = (this.pokemonToTM[pokemon.toLowerCase()] as any[]).map(this.formatTM.bind(this));
  }

  private formatTM(tm: string): string {
    return tm.toUpperCase().split(' ').join('-').concat(' ( ', this.tmNames[tm], ' )');
  }

  detailsOf(pokemonSelected: string): PokemonDetail | undefined {
    return pokemonSelected && this.pokemons[pokemonSelected];
  }

  elementOf(pokemonSelected: string): PokemonTypes {
    return this.pokemons[pokemonSelected]?.type;
  }

  prevPokemonForm(pokemonSelected: string): string {
    return this.detailsOf(pokemonSelected)?.prevForm;
  }

  saveSelected(): void {
    this.userDataService.saveUserPokemon(this.pokemonSelected);
    this.userPokemons = this.userDataService.getUserPokemons();
  }

  removeSelected(): void {
    this.userDataService.removeUserPokemon(this.pokemonSelected);
    this.userPokemons = this.userDataService.getUserPokemons();
  }

  isUserPokemon(pokemonSelected: string): boolean {
    return this.userPokemons.includes(pokemonSelected);
  }
}
