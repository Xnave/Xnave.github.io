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
  strongerElements: PokemonTypes[];

  constructor(private pokemonService: PokemonService) {
    this.typesGraph = pokemonService.getEffectiveGraph();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.weakerElements = this.typesGraph[changes.elementName.currentValue]?.superEffective || [];
    this.strongerElements = this.typesGraph[changes.elementName.currentValue]?.weak || [];
  }

  computeTranslate(): string {
    if (this.strongerElements.length > 0) {
      let translate = 25 * (this.strongerElements.length - 1);
      translate = translate > 90 ? 90 : translate;
      return 'translateX(-' + translate + 'px)';
    }
    return '';
  }
}
