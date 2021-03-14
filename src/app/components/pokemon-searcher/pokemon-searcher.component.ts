import { Component, OnInit } from '@angular/core';
import {PokemonService} from '../../services/pokemon.service';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-pokemon-searcher',
  templateUrl: './pokemon-searcher.component.html',
  styleUrls: ['./pokemon-searcher.component.css']
})
export class PokemonSearcherComponent implements OnInit {
  pokemonToTM;
  tmNames;
  pokemonTMs: string[];
  pokemonSelected: string;
  pokemonNames: string[];
  filteredPokemonNames: Observable<string[]>;
  pokemonSearchControl = new FormControl();
  typesGraph: any;

  constructor(private pokemonService: PokemonService) {
    pokemonService.getTmNames((res) => {
      this.tmNames = res;
    });
    pokemonService.getTmDataByPokemon((res) => {
      this.pokemonToTM = res;
      this.pokemonNames = Object.keys(this.pokemonToTM);
    });
    this.typesGraph = pokemonService.getTypesGraph();
  }

  ngOnInit(): void {
    this.filteredPokemonNames = this.pokemonSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.pokemonNames?.filter(option => option.toLowerCase().includes(filterValue)) || [];
  }

  updatePokemonDetails(pokemon: string): any {
    this.pokemonTMs = (this.pokemonToTM[pokemon.toLowerCase()] as any[]).map(this.formatTM.bind(this));
  }

  private formatTM(tm: string): string {
    return tm.toUpperCase().split(' ').join('-').concat(' ( ', this.tmNames[tm], ' )');
  }
}
