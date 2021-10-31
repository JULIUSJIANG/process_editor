import globalContext from "../GlobalContext";
import multipleSplats from "./multipleSplats";
import splatPointer from "./splatPointer";

export default function applyInputs () {
    if (globalContext.splatStack.length > 0)
        multipleSplats(globalContext.splatStack.pop());

        globalContext.pointers.forEach(p => {
        if (p.moved) {
            p.moved = false;
            splatPointer(p);
        }
    });
}