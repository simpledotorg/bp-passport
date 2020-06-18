export class ScatterGraphDataPoint {
  public x: number
  public y: number

  constructor(index: number, reading: number) {
    this.x = index
    this.y = reading
  }
}
