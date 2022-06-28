
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {

  constructor(private http: HttpClient) { }
 

  getuidUrl = 'https://uhunt.onlinejudge.org/api/uname2uid/';
  getAllUrl = 'https://uhunt.onlinejudge.org/api/subs-user/';
  getCodechefUrl='https://competitive-coding-api.herokuapp.com/api/codechef/';
  getSPOJUrl="https://competitive-coding-api.herokuapp.com/api/spoj/";
  getCFUrl="https://codeforces.com/api/user.info?handles=";
  getCFextraUrl="https://codeforces.com/api/user.status?handle=";
  

  uvaid!: string;
  uvaname!: any;
  uvauname!:any;
  uvasubs!:any;

  spoj!: any;

  codeforcesinfo!: any;
  codeforcesextra!: any;

  codechef!: any;


  uvaResponseCode!:any;
  codechefResponseCode!:any;
  spojResponseCode!:any;
  cfResponseCode!:any;
  
  
  ngOnInit(): void {
    this.getUvaIdCode("diegoroca17");
    this.getCodeChefAll("shauryagupta12");
    this.getSPOJAll("macbon");
    this.getCFAll("tourist");
  }

  getCFAll(username:string):void {
    this.http.get(this.getCFUrl+username,{observe:'response'}).subscribe((response: any) => {
      this.cfResponseCode=response.status;
      this.codeforcesinfo = response.body;
      this.codeforcesinfo=this.codeforcesinfo.result[0];

    })
  }

  getSPOJAll(username:string):void {
    this.http.get(this.getSPOJUrl+username,{observe:'response'}).subscribe((response: any) => {
      this.spoj = response.body;
      this.spojResponseCode=response.status;
    })
  }

  getCodeChefAll(username:string):void {
    this.http.get(this.getCodechefUrl+username,{observe:'response'}).subscribe((response: any) => {
      this.codechef = response.body;
      this.codechefResponseCode=response.status;
    })
  }

  getUvaAllInfo(uid: string): void {
    this.http.get(this.getAllUrl + uid,{observe:'response'}).subscribe((response: any) => {
      this.uvaname = response.body["name"];
      this.uvauname = response.body["uname"];
      this.uvasubs = response.body["subs"];
    });
  }
  getUvaIdCode(username:string):void {
    this.http.get(this.getuidUrl+username,{observe:'response'}).subscribe((response: any) => {
      this.uvaid = response.body;
      this.getUvaAllInfo(this.uvaid);
      this.uvaResponseCode=response.status;
    })
  }





}
