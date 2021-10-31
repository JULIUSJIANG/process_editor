import globalContext from "../GlobalContext";
import { PointerPrototype } from "../struct/PointerPrototype";
import correctDeltaX from "./correctDeltaX";

export default function updatePointerMoveData (pointer: PointerPrototype, posX: number, posY: number) {
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = posX / globalContext.canvas.width;
    pointer.texcoordY = 1.0 - posY / globalContext.canvas.height;
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = correctDeltaX(pointer.texcoordY - pointer.prevTexcoordY);
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
}