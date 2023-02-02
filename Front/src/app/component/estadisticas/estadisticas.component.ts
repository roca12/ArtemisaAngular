import {HttpClient} from '@angular/common/http';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import uvaproblems from '../../../assets/jsons/uvaproblems.json'
import {Chart, ChartConfiguration, ChartItem, registerables} from 'chart.js'
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {BlockUI, NgBlockUI} from "ng-block-ui";

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit, AfterViewInit {

  constructor(private http: HttpClient) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @BlockUI() blockUI: NgBlockUI;


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
  usernameUva = '';
  searchUva = true;
  dataSource = new MatTableDataSource<any>();
  uvaveredicts = [0, 0, 0, 0, 0, 0];
  uvastats = Array();
  uvatried = new Set();
  uvasolved = new Set();
  uvachart: any;


  listatemas = uvaproblems;

  spoj!: any;
  usernamespoj = "";

  codeforcesinfo!: any;
  codeforcesextra!: any;
  searchcf = false;
  cfdate: any;

  codechef!: any;
  codechefgraph = Array();
  searchspoj = false;


  uvaResponseCode!: any;
  uvaProblemResponseCode: any;
  codechefResponseCode!: any;

  searchcc = false;
  usernamecc = '';

  spojResponseCode!: any;
  cfResponseCode!: any;
  displayedColumns: string[] = ['Fecha y hora', '# problema', 'Nombre', 'Veredicto', 'Lenguaje'];


  leetcodeinfo = "";

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

  }

  ngOnInit(): void {

    this.getCFAll("tourist");
  }


  createCodeChefChart(): void {
    Chart.register(...registerables);
    const data = {
      labels: [],
      datasets: [{
        label: 'Completamente Resueltos',
        backgroundColor: 'rgb(99, 255, 20)',
        data: this.codechefgraph[0],
        hoverOffset: 4,
      }, {
        label: 'Parcialmente resueltos Resueltos',
        backgroundColor: 'rgb(255, 20, 20)',
        data: this.codechefgraph[1],
        hoverOffset: 4,
      }
      ]
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          display: false
        }
      }
    }
    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: options
    }
    const chartItem: ChartItem = document.getElementById('uva-chartcc') as ChartItem
    new Chart(chartItem, config)
  }

  searchNicknameUva(): void {
    this.dataSource.data = [];
    this.dataSource.paginator = this.paginator;
    this.blockUI.start();
    this.getUvaIdCode(this.usernameUva);
    setTimeout(() => {
      this.createUvaChart();
      this.blockUI.stop();
    }, 2500);
    this.searchUva = false;

  }

  searchNicknameCodeChef(): void {

    this.getCodeChefAll();
    this.searchcc = false;

  }

  searchNicknameSPOJ(): void {

    this.getSPOJAll(this.usernamespoj);
    this.searchspoj = false;

  }

  calculateStatsUVA(): void {
    let precision = this.uvaveredicts[0] / this.uvadata.length * 100;
    this.uvastats = Array()

    this.uvastats.push(parseFloat(precision.toString()).toFixed(2).toString() + "%");
  }

  createUvaChart(): void {
    Chart.register(...registerables);
    const data = {
      labels: [
        'Accepted',
        'Wrong Answer',
        'Runtime Error',
        'Time Limit',
        'Compilation Error',
        "Otro"],
      datasets: [{
        label: 'Online Judge Submissions',
        backgroundColor: [
          'rgb(99, 255, 20)',
          'rgb(255, 20, 20)',
          'rgb(241, 245, 24)',
          'rgb(43, 255, 234)',
          'rgb(222, 49, 193)',
          'rgb(69, 63, 63)'],
        data: this.uvaveredicts,
        hoverOffset: 4,
      }]
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          display: false
        }
      }
    }
    const config: ChartConfiguration = {
      type: 'doughnut',
      data: data,
      options: options
    }

    const chartItem: ChartItem = document.getElementById('uva-chart') as ChartItem
    if (this.uvachart) {
      this.uvachart.destroy()
    }
    this.uvachart = new Chart(chartItem, config)
  }

  subsToData(alldata: any): void {
    this.uvadata = Array()
    this.uvastats = Array()
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
      let ver = this.getUvaSubmissionVereditc(linea[2])
      lineadata.push(ver);
      if (ver == "AC") {
        this.uvasolved.add(problemdata[2]);
        this.uvatried.add(problemdata[2]);
      } else {
        this.uvatried.add(problemdata[2]);
      }
      //fecha envio
      const date = new Date(linea[4] * 1000);
      lineadata.push(date.toLocaleDateString("es-CO") + " " + date.toLocaleTimeString("es-CO"));
      //lenguaje
      lineadata.push(this.getUvaLanguage(linea[5]));
      this.uvadata.push(lineadata);
    }
    this.uvastats.push(this.uvadata[0][4])
    this.uvastats.push(this.uvadata[this.uvadata.length - 1][4])
    this.dataSource.data = this.uvadata;


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
        this.uvaveredicts[5]++;
        return "SE";
      case 15:
        this.uvaveredicts[5]++;
        return "CBJ";
      case 20:
        this.uvaveredicts[5]++;
        return "IQ";
      case 30:
        this.uvaveredicts[4]++;
        return "CE";
      case 35:
        this.uvaveredicts[5]++;
        return "RF";
      case 40:
        this.uvaveredicts[2]++;
        return "RE";
      case 45:
        this.uvaveredicts[5]++;
        return "OLE";
      case 50:
        this.uvaveredicts[3]++;
        return "TLE";
      case 60:
        this.uvaveredicts[5]++;
        return "MLE";
      case 70:
        this.uvaveredicts[1]++;
        return "WA";
      case 80:
        this.uvaveredicts[5]++;
        return "PE";
    }
    this.uvaveredicts[0]++;
    this.calculateStatsUVA()
    return "AC";
  }

  getCFAll(username: string): void {
    this.http.get(this.getCFUrl + username, {observe: 'response'}).subscribe((response: any) => {
      this.cfResponseCode = response.status;
      this.codeforcesinfo = response.body;
      this.codeforcesinfo = this.codeforcesinfo.result[0];
      this.epochToDate(this.codeforcesinfo.registrationTimeSeconds);

    })
  }

  getSPOJAll(username: string): void {
    this.http.get(this.getSPOJUrl + username, {observe: 'response'}).subscribe((response: any) => {
      this.spoj = response.body;
      this.spojResponseCode = response.status;
    })
  }

  getCodeChefAll(): void {
    this.http.get(this.getCodechefUrl + this.usernamecc, {observe: 'response'}).subscribe((response: any) => {
      this.codechef = response.body;
      this.codechefResponseCode = response.status;
    })
  }

  getUvaAllInfo(uid: string): void {
    this.http.get(this.getAllUrl + uid, {observe: 'response'}).subscribe((response: any) => {
      this.uvaname = response.body["name"];
      this.uvauname = response.body["uname"];
      this.uvasubs = response.body["subs"];
      this.subsToData(this.uvasubs);
    });
  }

  getUvaIdCode(username: string): void {
    this.http.get(this.getuidUrl + username, {observe: 'response'}).subscribe((response: any) => {
      this.uvaid = response.body;
      this.getUvaAllInfo(this.uvaid);
      this.uvaResponseCode = response.status;
    })
  }

  epochToDate(epoch: number): void {
    const date = new Date(epoch * 1000);
    this.cfdate = date.toLocaleDateString("es-CO") + " " + date.toLocaleTimeString("es-CO");
  }
}
