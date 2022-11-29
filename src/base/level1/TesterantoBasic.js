export class TesterantoBasic {
    // thatOverides: Record<
    //   keyof ThatExtensions,
    //   (selection: ISelection, expectation: any) => BaseThat<ISelection>
    // >;
    constructor(cc, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides
    // thatOverides: Record<
    //   keyof ThatExtensions,
    //   (selection: ISelection, expectation: any) => BaseThat<ISelection>
    // >
    ) {
        this.cc = cc;
        this.constructorator = cc;
        this.suitesOverrides = suitesOverrides;
        this.givenOverides = givenOverides;
        this.whenOverides = whenOverides;
        this.thenOverides = thenOverides;
        this.checkOverides = checkOverides;
        // this.thatOverides = thatOverides;
    }
    Suites() {
        return this.suitesOverrides;
    }
    Given() {
        return this.givenOverides;
    }
    When() {
        return this.whenOverides;
    }
    Then() {
        return this.thenOverides;
    }
    Check() {
        return this.checkOverides;
    }
}
