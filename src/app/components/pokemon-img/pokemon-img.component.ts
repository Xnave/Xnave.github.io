import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {PokemonDetail, PokemonDetails, PokemonService} from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-img',
  templateUrl: './pokemon-img.component.html',
  styleUrls: ['./pokemon-img.component.css']
})
export class PokemonImgComponent implements OnInit {
  @Input() pokemonName: string;
  @Input() pokemons: PokemonDetails;
  @Input() small: boolean;
  src: string = 'initial';

  constructor(private pokemonService: PokemonService) {
    pokemonService.getPokemonsDetails((pokemons) => {
      this.pokemons = pokemons;
      this.src = this.calcSource();
    });
  }

  ngOnInit(): void {
    this.src = this.calcSource();
  }

  detailsOf(pokemonSelected: string): PokemonDetail | undefined {
    return this.pokemons[pokemonSelected];
  }

  calcSource(): string {
    if (this.detailsOf(this.pokemonName) != null) {
      return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this.detailsOf(this.pokemonName).number + '.png';
    }
    return 'nave';
  }
}
