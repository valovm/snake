enum Sides {
    left,
    right,
    top,
    bottom
}

function getRandomInt(max: number, min: number = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function reverseSide(side: Sides): Sides {
    switch (side) {
        case Sides.bottom: return Sides.top; break
        case Sides.top: return Sides.bottom; break
        case Sides.left: return Sides.right; break
        case Sides.right: return Sides.left; break
    }
    return side;
}

export { Sides, reverseSide,  getRandomInt }
