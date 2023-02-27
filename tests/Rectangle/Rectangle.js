class Rectangle {
    constructor(height = 2, width = 2) {
        this.height = height;
        this.width = width;
    }
    getHeight() {
        return this.height;
    }
    getWidth() {
        return this.width;
    }
    setHeight(height) {
        this.height = height;
    }
    setWidth(width) {
        this.width = width;
    }
    area() {
        return this.width * this.height;
    }
    circumference() {
        return this.width * 2 + this.height * 2;
    }
}
export default Rectangle;
