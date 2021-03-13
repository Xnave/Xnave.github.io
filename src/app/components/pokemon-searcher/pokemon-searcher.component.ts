import { Component, OnInit } from '@angular/core';
import {PokemonService} from '../../services/pokemon.service';
import {FormControl} from '@angular/forms';

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

  constructor(private pokemonService: PokemonService) {
    pokemonService.getTmNames((res) => {
      this.tmNames = res;
    });
    pokemonService.getTmDataByPokemon((res) => {
      this.pokemonToTM = res;
      this.pokemonNames = Object.keys(this.pokemonToTM);
    });
  }

  ngOnInit(): void {
  }

  updatePokemonDetails(pokemon: string): any {
    this.pokemonTMs = (this.pokemonToTM[pokemon.toLowerCase()] as any[]).map(this.formatTM.bind(this));
  }

  private formatTM(tm: string): string {
    return tm.toUpperCase().split(' ').join('-').concat(' ( ', this.tmNames[tm], ' )');
  }
}
