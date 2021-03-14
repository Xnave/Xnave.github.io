import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PokemonService, PokemonTypes, TypesGraph} from '../../services/pokemon.service';

@Component({
  selector: 'app-element-to-effective',
  templateUrl: './element-to-effective.component.html',
  styleUrls: ['./element-to-effective.component.css']
})
export class ElementToEffectiveComponent implements OnChanges {
  @Input() elementName: string;
  @Input() descr?: string;
  private typesGraph: TypesGraph;
  weakerElements: PokemonTypes[];

  constructor(private pokemonService: PokemonService) {
    this.typesGraph = pokemonService.getEffectiveGraph();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.weakerElements = this.typesGraph[changes.elementName.currentValue]?.superEffective || [];
  }
}
