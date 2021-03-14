import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-element-icon',
  templateUrl: './element-icon.component.html',
  styleUrls: ['./element-icon.component.css']
})
export class ElementIconComponent implements OnInit {
  @Input()
  elementName: string;

  constructor() { }

  ngOnInit(): void {
  }

}
