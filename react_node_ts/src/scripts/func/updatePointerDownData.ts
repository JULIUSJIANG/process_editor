import globalContext from "../GlobalContext";
import { PointerPrototype } from "../struct/PointerPrototype";
import generateColor from "./generateColor";

export default function updatePointerDownData (pointer: PointerPrototype, id: number, posX: number, posY: number) {
    pointer.id = id;
    pointer.down = true;
    pointer.moved = false;
    pointer.texcoordX = posX / globalContext.canvas.width;
    pointer.texcoordY = 1.0 - posY / globalContext.canvas.height;
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.deltaX = 0;
    pointer.deltaY = 0;
    pointer.color = generateColor();
}