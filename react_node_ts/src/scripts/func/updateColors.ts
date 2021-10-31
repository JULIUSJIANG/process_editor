import wrap from "./wrap";
import globalContext from "../GlobalContext";
import generateColor from "./generateColor";

export default function updateColors (dt: number) {
    if (!globalContext.config.COLORFUL) return;

    globalContext.colorUpdateTimer += dt * globalContext.config.COLOR_UPDATE_SPEED;
    if (globalContext.colorUpdateTimer >= 1) {
        globalContext.colorUpdateTimer = wrap(globalContext.colorUpdateTimer, 0, 1);
        globalContext.pointers.forEach(p => {
            p.color = generateColor();
        });
    }
}