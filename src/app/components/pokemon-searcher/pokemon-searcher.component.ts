import { Component, OnInit } from '@angular/core';
import {PokemonService} from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-searcher',
  templateUrl: './pokemon-searcher.component.html',
  styleUrls: ['./pokemon-searcher.component.css']
})
export class PokemonSearcherComponent implements OnInit {
  pokemonToTM;
  pokemonTMDetails;
  pokemonName: any;

  constructor(private pokemonService: PokemonService) {
    pokemonService.getTmDataByPokemon((res) => {
      this.pokemonToTM = res;
    });
  }

  ngOnInit(): void {
  }

  updatePokemonDetails(pokemon: string): any {
    this.pokemonTMDetails = (this.pokemonToTM[pokemon.toLowerCase()] as any[]).map(this.formatTM).join(', ');
  }

  private formatTM(tm: string): string {
    return tm.toUpperCase().split(' ').join('-');
  }
}
