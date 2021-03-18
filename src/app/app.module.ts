import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PokemonSearcherComponent } from './components/pokemon-searcher/pokemon-searcher.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ElementIconComponent } from './components/element-icon/element-icon.component';
import { ElementToEffectiveComponent } from './components/element-to-effective/element-to-effective.component';
import { ElementToWeaknessComponent } from './components/element-to-weakness/element-to-weakness.component';
import { PokemonEffectsComponent } from './components/pokemon-effects/pokemon-effects.component';
import { PokemonImgComponent } from './components/pokemon-img/pokemon-img.component';

@NgModule({
  declarations: [
    AppComponent,
    PokemonSearcherComponent,
    ElementIconComponent,
    ElementToEffectiveComponent,
    ElementToWeaknessComponent,
    PokemonEffectsComponent,
    PokemonImgComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
