
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import uvaproblems from '../../../assets/jsons/uvaproblems.json'

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {

  constructor(private http: HttpClient) { }


  getuidUrl = 'https://uhunt.onlinejudge.org/api/uname2uid/';
  getAllUrl = 'https://uhunt.onlinejudge.org/api/subs-user/';
  getuvaproblem = 'https://uhunt.onlinejudge.org/api/p/id/';

  getCodechefUrl = 'https://competitive-coding-api.herokuapp.com/api/codechef/';

  getSPOJUrl = "https://competitive-coding-api.herokuapp.com/api/spoj/";

  getCFUrl = "https://codeforces.com/api/user.info?handles=";
  getCFextraUrl = "https://codeforces.com/api/user.status?handle=";


  uvaid!: string;
  uvaname!: any;
  uvauname!: any;
  uvasubs!: any;
  uvadata = Array();


  listatemas = uvaproblems;

  spoj!: any;

  codeforcesinfo!: any;
  codeforcesextra!: any;

  codechef!: any;


  uvaResponseCode!: any;
  uvaProblemResponseCode: any;
  codechefResponseCode!: any;
  spojResponseCode!: any;
  cfResponseCode!: any;

  ngOnInit(): void {
    this.getUvaIdCode("diegoroca17");
    this.getCodeChefAll("shauryagupta12");
    this.getSPOJAll("macbon");
    this.getCFAll("tourist");
  }

  subsToData(alldata: any): void {
    //console.log(alldata);
    alldata.sort((a: any, b: any) => b[4] - a[4]);
    for (let linea of alldata) {
      //console.log(linea);
      let lineadata = Array();

      let problemdata = this.problemIDtoCode(linea[1]);

      //info del problema
      if (problemdata.length != 0) {
        lineadata.push(problemdata[0]);
        lineadata.push(problemdata[1]);
        lineadata.push(problemdata[2]);
      } else {
        continue;
      }

      //veredicto
      lineadata.push(this.getUvaSubmissionVereditc(linea[2]));
      //fecha envio
      const date = new Date(linea[4] * 1000);
      lineadata.push(date.toLocaleDateString("es-CO") + " " + date.toLocaleTimeString("es-CO"));
      //lenguaje
      lineadata.push(this.getUvaLanguage(linea[5]));
      this.uvadata.push(lineadata);
    }


  }

  problemIDtoCode(dato: number): Array<any> {
    let lista = Array();
    for (let i = 0; i < this.listatemas.length; i++) {
      if (this.listatemas[i][0] == dato) {
        lista.push(this.listatemas[i][0])
        lista.push(this.listatemas[i][1])
        lista.push(this.listatemas[i][2])
        return lista;
      }
    }
    return lista;
  }

  getUvaLanguage(dato: any): string {
    switch (dato) {
      case 2:
        return "JAVA";
      case 3:
        return "C++";
      case 4:
        return "PASCAL";
      case 5:
        return "C++ 11";
      case 6:
        return "PYTHON";

    }
    return "ANSI C";
  }

  getUvaSubmissionVereditc(dato: any): string {
    switch (dato) {
      case 10:
        return "SE";
      case 15:
        return "CBJ";
      case 20:
        return "IQ";
      case 30:
        return "CE";
      case 35:
        return "RF";
      case 40:
        return "RE";
      case 45:
        return "OLE";
      case 50:
        return "TLE";
      case 60:
        return "MLE";
      case 70:
        return "WA";
      case 80:
        return "PE";
    }

    return "AC";
  }



  getCFAll(username: string): void {
    this.http.get(this.getCFUrl + username, { observe: 'response' }).subscribe((response: any) => {
      this.cfResponseCode = response.status;
      this.codeforcesinfo = response.body;
      this.codeforcesinfo = this.codeforcesinfo.result[0];

    })
  }

  getSPOJAll(username: string): void {
    this.http.get(this.getSPOJUrl + username, { observe: 'response' }).subscribe((response: any) => {
      this.spoj = response.body;
      this.spojResponseCode = response.status;
    })
  }

  getCodeChefAll(username: string): void {
    this.http.get(this.getCodechefUrl + username, { observe: 'response' }).subscribe((response: any) => {
      this.codechef = response.body;
      this.codechefResponseCode = response.status;
    })
  }

  getUvaAllInfo(uid: string): void {
    this.http.get(this.getAllUrl + uid, { observe: 'response' }).subscribe((response: any) => {
      this.uvaname = response.body["name"];
      this.uvauname = response.body["uname"];
      this.uvasubs = response.body["subs"];
      this.subsToData(this.uvasubs);
    });
  }
  getUvaIdCode(username: string): void {
    this.http.get(this.getuidUrl + username, { observe: 'response' }).subscribe((response: any) => {
      this.uvaid = response.body;
      this.getUvaAllInfo(this.uvaid);
      this.uvaResponseCode = response.status;
    })
  }





}
