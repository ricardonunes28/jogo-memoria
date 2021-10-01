import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Carta} from './carta.model'
import {ReiniciarJogoComponent} from './reiniciar-jogo'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 

  idCartas = [
    '01.png',
    '02.png',
    '03.png',
    '04.png',
    '05.png'
  ];


cartas: Carta[] = [];

inverterCartas: Carta[] = [];


title = 'Jogo da Memória';

embaralharCartas(anArray: any[]): any[] {
  return anArray.map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);
}

constructor(private dialog: MatDialog) {

}

ngOnInit(): void {
  this.carregarCartas();
}

carregarCartas(): void {
  this.cartas = [];
  
  this.idCartas.forEach((image) => {
    const cardData: Carta = {
      idImagem: image,
      state: 'verso'
    };
    this.cartas.push({ ...cardData });
    this.cartas.push({ ...cardData });
  });
  
  this.cartas = this.embaralharCartas(this.cartas);
}

cartaClicada(index: number): void {
  const cartaStatus = this.cartas[index];

  if (cartaStatus.state === 'verso' && this.inverterCartas.length < 2) {
    cartaStatus.state = 'frente';
    this.inverterCartas.push(cartaStatus);

    if (this.inverterCartas.length > 1) {
      this.checaPar();
    }

  } else if (cartaStatus.state === 'frente') {
    cartaStatus.state = 'verso';
    this.inverterCartas.pop();

  }
}

  contagemPares = 0;

checaPar(): void {
  setTimeout(() => {
    const cartaUm = this.inverterCartas[0];
    const cartaDois = this.inverterCartas[1];
    const proximoStatus = cartaUm.idImagem === cartaDois.idImagem ? 'par' : 'verso';
    cartaUm.state = cartaDois.state = proximoStatus;

    this.inverterCartas = [];

    if (proximoStatus === 'par') {
      this.contagemPares++;

      if (this.contagemPares === this.idCartas.length) {
        const dialogRef = this.dialog.open(ReiniciarJogoComponent, {
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(() => {
          this.reiniciar();
        });
      }
    }

  }, 1000);
}


reiniciar(): void {
  this.contagemPares = 0;
  this.carregarCartas();
}






}


