import globalContext from "../GlobalContext";
import { PointerPrototype } from "../struct/PointerPrototype";
import splat from "./splat";

export function splatPointer (pointer: PointerPrototype) {
    let dx = pointer.deltaX * globalContext.config.SPLAT_FORCE;
    let dy = pointer.deltaY * globalContext.config.SPLAT_FORCE;
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
}