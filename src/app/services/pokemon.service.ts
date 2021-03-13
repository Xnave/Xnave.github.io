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
  private pokemonToTmList;
  pokemonsExcelLoaded = new Subject<any>();

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
}
