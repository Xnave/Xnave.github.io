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
  private tmDetailsList: {[key: string]: TmDetails};
  private pokemonToTmList;
  pokemonsExcelLoaded = new Subject<any>();
  tmNamesEvaluated = new Subject<any>();
  pokemonsDetailsLoaded = new Subject<any>();
  tmDetailsLoaded = new Subject<any>();
  private pokemonDetailsList: PokemonDetails = {};

  constructor() {
    this.loadTmExcel();
    this.loadPokemonsDetailsExcel();
  }

  loadTmExcel(): void {
    this.getExcel('/assets/pokemon_attacks.xlsm').then((res) => {
      this.file = res.data;
      this.readExcelFile(this.loadTmRows.bind(this), 0);
      this.readExcelFile(this.loadTmDetailsRows.bind(this), 1);
    });
  }

  loadPokemonsDetailsExcel(): void {
    this.getExcel('/assets/pokemon_details_list.xlsx').then((res) => {
      this.file = res.data;
      this.readExcelFile(this.loadPokemonDetailsRows.bind(this));
    });
  }

  private getExcel(path): Promise<any> {
    return axios.get(path, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'blob',
      }
    });
  }

  readExcelFile(cb: (rows) => void, sheetNum = 0): any {
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
      const firstSheetName = workbook.SheetNames[sheetNum];
      const worksheet = workbook.Sheets[firstSheetName];
      cb(XLSX.utils.sheet_to_json(worksheet, {raw: true}));
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  loadTmRows(rows: any[]): void {
    this.tmsList = {};
    this.tmNames = {};
    for (const tm of Object.keys(rows[0])) {
      this.tmNames[tm] = rows[0][tm];
    }
    this.tmNamesEvaluated.next(this.tmNames);

    rows.forEach((row, index) => {
      if (index === 0) { return; } // TM names
      const tms: string[] = Object.keys(row);
      tms.forEach((tm) => {
         // = tm.split(' ').join();
        if (this.tmsList[tm] == null) {
          this.tmsList[tm] = [];
        }
        this.tmsList[tm].push(row[tm]);
      });
    });
    this.loadTmDataByPokemon();
    this.pokemonsExcelLoaded.next(this.pokemonToTmList);
  }

  convertTmDetails(row: TmDetailsRow): TmDetails {
    return {
      descr: row.attack,
      type: this.convertType(row.type),
      name: row.number
    };
  }

  loadTmDetailsRows(rows: any[]): void {
    this.tmDetailsList = {};

    rows.forEach((row: TmDetailsRow, index) => {
      if (Object.keys(row).includes('name')) {
        this.tmDetailsList[row.number.toLowerCase()] = this.convertTmDetails(row);
      }
    });
    console.log(this.tmDetailsList);
    this.tmDetailsLoaded.next(this.tmDetailsList);
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

  loadPokemonDetailsRows(rows: PokemonDetailsRow[]): void {

    rows.forEach((row, index) => {
      const nameAsIndex = row['pokemon name'].toLowerCase();
      this.pokemonDetailsList[nameAsIndex] = this.fromPokemonDetailsRow(row);
    });
    for (const pokemon of Object.keys(this.pokemonDetailsList)) {
      const evolution = this.pokemonDetailsList[pokemon].evolution;
      if (evolution) {
        this.pokemonDetailsList[evolution].prevForm = pokemon;
      }
    }
    this.pokemonsDetailsLoaded.next(this.pokemonDetailsList);
  }


  private convertType(element?: string): PokemonTypes {
    if (element?.toLowerCase() === 'psychic') {
      return PokemonTypes.psych;
    }
    return element?.toLowerCase() as PokemonTypes;
  }

  fromPokemonDetailsRow(row: PokemonDetailsRow): PokemonDetail {
    return {
      number: row['pokemon num'],
      first_attack_name: row['first attack'],
      first_attack_type: this.convertType(row['attack type']),
      second_attack_name: row['secand attack'],
      second_attack_type: this.convertType(row['attack type_1']),
      type: this.convertType(row['pokemon type']),
      evolution: row.evolve?.toLowerCase()
    };
  }

  public getPokemonsDetails(cb: (PokemonDetails) => any): any {
    return this.pokemonsDetailsLoaded.subscribe(cb);
  }

  public getTmDetails(cb: (PokemonDetails) => any): any {
    return this.tmDetailsLoaded.subscribe(cb);
  }

  public getEffectiveAgainstGraph(): {[key: string]: PokemonTypes[]} {
    const effectiveAgainstGraph = {};
    const graph = this.getEffectiveGraph();
    for (const strongElement of Object.keys(graph)) {
      for (const weakElement of graph[strongElement].superEffective) {
        if (effectiveAgainstGraph[weakElement] == null) {
          effectiveAgainstGraph[weakElement] = [];
        }
        effectiveAgainstGraph[weakElement].push(strongElement);
      }
    }
    return effectiveAgainstGraph;
  }

  public getEffectiveGraph(): TypesGraph {
    return {
      normal: {
        superEffective: [],
        weak: [PokemonTypes.rock, PokemonTypes.ghost],
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

interface PokemonDetailsRow {
  'attack type': string; // att 1 type
  'attack type_1': string; // att 2 type
  'first attack': string; // att 1 name
  'pokemon name': string;
  'pokemon num': string;
  'pokemon type': string; // att 2 type
  'secand attack': string; // att 2 name
  'evolve': string;
}

interface TmDetailsRow {
  'attack': string; // atk details
  'name': string; // description
  'number': string; // tm name
  'type': string;
}

export interface TmDetails {
  'descr': string;
  'type': string;
  'name': string;
}

export class TypesGraph {
  [key: string]: {
    superEffective: PokemonTypes[],
    weak: PokemonTypes[]
  }
}

export interface PokemonDetail {
  number: string;
  type: PokemonTypes;
  first_attack_name: string;
  first_attack_type: PokemonTypes;
  second_attack_name?: string;
  second_attack_type?: PokemonTypes;
  evolution?: string;
  prevForm?: string;
}

export class PokemonDetails {
  [key: string]: PokemonDetail
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
