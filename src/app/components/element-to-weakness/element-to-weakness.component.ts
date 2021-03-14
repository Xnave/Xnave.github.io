import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PokemonService, PokemonTypes, TypesGraph} from '../../services/pokemon.service';

@Component({
  selector: 'app-element-to-weakness',
  templateUrl: './element-to-weakness.component.html',
  styleUrls: ['./element-to-weakness.component.css']
})
export class ElementToWeaknessComponent implements OnChanges {
  @Input() elementName: string;
  private effectiveAgainstGraph:  {[key: string]: PokemonTypes[]};
  strongerElements: PokemonTypes[];

  constructor(private pokemonService: PokemonService) {
    this.effectiveAgainstGraph = pokemonService.getEffectiveAgainstGraph();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.strongerElements = this.effectiveAgainstGraph[changes.elementName.currentValue] || [];
  }

}
