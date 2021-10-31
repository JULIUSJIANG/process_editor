import Color from "../struct/Color";

export default function normalizeColor (input: Color) {
    let output = {
        r: input.r / 255,
        g: input.g / 255,
        b: input.b / 255
    };
    return output;
};