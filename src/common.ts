enum Sides {
    left,
    right,
    top,
    bottom,
}

enum Dirs {
    left,
    right,
    up,
    down,
}
interface Callback {
    name: string;
    callback: any;
}

function getRandomInt(max: number, min: number = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function reverseSide(side: Sides): Sides {
    switch (side) {
        case Sides.bottom: return Sides.top; break;
        case Sides.top: return Sides.bottom; break;
        case Sides.left: return Sides.right; break;
        case Sides.right: return Sides.left; break;
    }
    return side;
}

function reverseDir(dir: Dirs): Dirs {
    switch (dir) {
        case Dirs.down: return Dirs.up; break;
        case Dirs.up: return Dirs.down; break;
        case Dirs.left: return Dirs.right; break;
        case Dirs.right: return Dirs.left; break;
    }
    return dir;
}

export { Dirs, Sides, reverseSide, reverseDir,  getRandomInt, Callback };
