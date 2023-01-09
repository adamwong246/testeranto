export class TesterantoLevelZero {
    constructor(cc, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides) {
        this.cc = cc;
        this.constructorator = cc;
        this.suitesOverrides = suitesOverrides;
        this.givenOverides = givenOverides;
        this.whenOverides = whenOverides;
        this.thenOverides = thenOverides;
        this.checkOverides = checkOverides;
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
