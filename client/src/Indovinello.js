class Indovinello {

  constructor(id, domanda, soluzione, sugg1, sugg2, difficolta, tempo, stato, user, startTime) {
    this.id = id;
    this.domanda = domanda;
    this.soluzione = soluzione;
    this.sugg1 = sugg1;
    this.sugg2 = sugg2;
    this.difficolta = difficolta;
    this.tempo = tempo;
    this.stato = stato;
    this.user = user;
    this.startTime = startTime
  }

}


export {Indovinello};