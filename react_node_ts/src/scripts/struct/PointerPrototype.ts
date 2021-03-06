import Color from "./Color";

export class PointerPrototype {
    id = -1;
    texcoordX = 0;
    texcoordY = 0;
    prevTexcoordX = 0;
    prevTexcoordY = 0;
    deltaX = 0;
    deltaY = 0;
    down = false;
    moved = false;
    color: Color = [30, 0, 300] as any;
}