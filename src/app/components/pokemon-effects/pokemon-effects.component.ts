import {Component, Input, OnInit} from '@angular/core';
import {PokemonDetail} from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-effects',
  templateUrl: './pokemon-effects.component.html',
  styleUrls: ['./pokemon-effects.component.css']
})
export class PokemonEffectsComponent implements OnInit {
  @Input() pokemon: PokemonDetail;

  constructor() { }

  ngOnInit(): void {
  }

}
