class RPS5 extends RPS {
  constructor(props) {
    super(props);

    this.radius = 4;
    this.threshold = 16;
    this.influenceAdvantage = 2;
    this.ordering = ['#7880b5', 'red', 'white', '#BCC4DB', 'black'];

    // this.initialise(randomMatrix(90, 90, this.ordering));
  }
}
