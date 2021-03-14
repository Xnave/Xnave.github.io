import {Injectable, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import axios from 'axios';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  arrayBuffer: any;
  file: File;
  private tmsList;
  private tmNames;
  private pokemonToTmList;
  pokemonsExcelLoaded = new Subject<any>();
  tmNamesEvaluated = new Subject<any>();

  constructor() {
    this.loadTmExcel();
  }

  loadTmExcel(): void {
    axios.get('/assets/pokemon_attacks.xlsm', {
      responseType: 'blob',
      headers: {
        'Content-Type': 'blob',
      }
    }).then((res) => {
      this.file = res.data;
      this.readExcelFile(this.loadRows.bind(this));
    });
  }

  readExcelFile(cb: (raws) => void): any {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, {type: 'binary'});
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      cb(XLSX.utils.sheet_to_json(worksheet, {raw: true}));
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  loadRows(raws: any[]): void {
    this.tmsList = {};
    this.tmNames = {};
    for (const tm of Object.keys(raws[0])) {
      this.tmNames[tm] = raws[0][tm];
    }
    this.tmNamesEvaluated.next(this.tmNames);

    raws.forEach((raw, index) => {
      if (index === 0) { return; } // TM names
      const tms: string[] = Object.keys(raw);
      tms.forEach((tm) => {
         // = tm.split(' ').join();
        if (this.tmsList[tm] == null) {
          this.tmsList[tm] = [];
        }
        this.tmsList[tm].push(raw[tm]);
      });
    });
    console.log(this.tmsList);
    this.loadTmDataByPokemon();
    console.log(this.pokemonToTmList);
    this.pokemonsExcelLoaded.next(this.pokemonToTmList);
  }

  public loadTmDataByPokemon(): any {
    if (this.pokemonToTmList == null) {
      this.pokemonToTmList = {};
      Object.keys(this.tmsList).forEach((tmName) => {
        this.tmsList[tmName].forEach((pokemonName) => {
          pokemonName = pokemonName.toLowerCase();
          if (this.pokemonToTmList[pokemonName] == null) {
            this.pokemonToTmList[pokemonName] = [];
          }
          this.pokemonToTmList[pokemonName].push(tmName);
        });
      });
    }
    return this.pokemonToTmList;
  }

  public getTmDataByPokemon(cb): any {
    return this.pokemonsExcelLoaded.subscribe(cb);
  }

  public getTmNames(cb): any {
    return this.tmNamesEvaluated.subscribe(cb);
  }

  public getPokemonsDetails(): any {
    return {
      Bulbasaur: {
        type: 'grass',
        first_attack_name: 'Vine Wipe',
        first_attack_type: 'grass',
        second_attack_name: 'Tackle',
        second_attack_type: 'normal',
      },
      Charmander: {
        type: 'fire',
        first_attack_name: 'Ember',
        first_attack_type: 'fire',
        second_attack_name: 'Scratch',
        second_attack_type: 'normal',
      },
      Weedle: {
        type: 'bug',
        first_attack_name: 'StringShot',
        first_attack_type: 'bug',
      },
      Squirtle: {
        type: 'bug',
        first_attack_name: 'Bubble',
        first_attack_type: 'water',
        second_attack_name: 'Tackle',
        second_attack_type: 'normal',
      }
    };
  }

  public getTypesGraph(): any {
    return {
      normal: {
        superEffective: [],
        weak: ['rock', 'ghost'],
      },
      grass: {
        superEffective: [PokemonTypes.ground, PokemonTypes.water, PokemonTypes.rock],
        weak: [PokemonTypes.flying, PokemonTypes.fire, PokemonTypes.bug, PokemonTypes.poison, PokemonTypes.grass, PokemonTypes.dragon],
      },
      fire: {
        superEffective: [PokemonTypes.ice, PokemonTypes.grass, PokemonTypes.bug],
        weak: [PokemonTypes.rock, PokemonTypes.fire, PokemonTypes.water, PokemonTypes.dragon],
      },
      water: {
        superEffective: [PokemonTypes.ground, PokemonTypes.rock, PokemonTypes.fire],
        weak: [PokemonTypes.water, PokemonTypes.grass, PokemonTypes.dragon],
      },
      fighting: {
        superEffective: [PokemonTypes.normal, PokemonTypes.rock, PokemonTypes.ice],
        weak: [PokemonTypes.flying, PokemonTypes.poison, PokemonTypes.ghost, PokemonTypes.bug, PokemonTypes.psych],
      },
      flying: {
        superEffective: [PokemonTypes.fighting, PokemonTypes.bug, PokemonTypes.grass],
        weak: [PokemonTypes.electric, PokemonTypes.rock],
      },
      poison: {
        superEffective: [PokemonTypes.grass],
        weak: [PokemonTypes.poison, PokemonTypes.ground, PokemonTypes.rock, PokemonTypes.ghost],
      },
      ground: {
        superEffective: [PokemonTypes.poison, PokemonTypes.rock, PokemonTypes.fire, PokemonTypes.electric],
        weak: [PokemonTypes.flying, PokemonTypes.bug, PokemonTypes.grass],
      },
      rock: {
        superEffective: [PokemonTypes.flying, PokemonTypes.bug, PokemonTypes.fire, PokemonTypes.ice],
        weak: [PokemonTypes.ground, PokemonTypes.fighting],
      },
      bug: {
        superEffective: [PokemonTypes.grass, PokemonTypes.psych],
        weak: [PokemonTypes.fighting, PokemonTypes.flying, PokemonTypes.poison, PokemonTypes.ghost, PokemonTypes.fire],
      },
      ghost: {
        superEffective: [PokemonTypes.ghost, PokemonTypes.psych],
        weak: [PokemonTypes.normal],
      },
      electric: {
        superEffective: [PokemonTypes.flying, PokemonTypes.water],
        weak: [PokemonTypes.ground, PokemonTypes.grass, PokemonTypes.electric, PokemonTypes.dragon],
      },
      psych: {
        superEffective: [PokemonTypes.fighting, PokemonTypes.poison],
        weak: [PokemonTypes.psych],
      },
      ice: {
        superEffective: [PokemonTypes.flying, PokemonTypes.ground, PokemonTypes.grass, PokemonTypes.dragon],
        weak: [PokemonTypes.fire, PokemonTypes.water, PokemonTypes.ice],
      },
      dragon: {
        superEffective: [PokemonTypes.dragon],
        weak: [],
      },
    };
  }
}

export enum PokemonTypes {
  normal = 'normal',
  rock = 'rock',
  ghost = 'ghost',
  grass = 'grass',
  poison = 'poison',
  bug = 'bug',
  fire = 'fire',
  water = 'water',
  flying = 'flying',
  ground = 'ground',
  dragon = 'dragon',
  ice = 'ice',
  psych = 'psych',
  electric = 'electric',
  fighting = 'fighting'
}
