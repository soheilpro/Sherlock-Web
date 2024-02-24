export class Sequence {
  private static seed: number = 0;

  public static next(): string {
    return (this.seed++).toString();
  }
}
