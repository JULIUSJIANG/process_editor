import DoubleFBO from "../struct/DoubleFBO";
import createFBO from "./createFBO";
import resizeFBO from "./resizeFBO";

export default function resizeDoubleFBO (target: DoubleFBO, w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
    if (target.width == w && target.height == h)
        return target;
    target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
    target.write = createFBO(w, h, internalFormat, format, type, param);
    target.width = w;
    target.height = h;
    target.texelSizeX = 1.0 / w;
    target.texelSizeY = 1.0 / h;
    return target;
}