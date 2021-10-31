import globalContext from "../GlobalContext";

export default function correctDeltaY (delta: number) {
    let aspectRatio = globalContext.canvas.width / globalContext.canvas.height;
    if (aspectRatio > 1) delta /= aspectRatio;
    return delta;
}