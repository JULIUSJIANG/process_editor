import Color from "../struct/Color";

export default function HSVtoRGB (h: number, s: number, v: number): Color {
    let r: number, g: number, b: number, i: number, f: number, p: number, q: number, t: number;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    let tag = i % 6;
    switch (tag) {
        case 0: 
            r = v;
            g = t;
            b = p; 
            break;
        case 1: 
            r = q;
            g = v;
            b = p; 
            break;
        case 2: 
            r = p;
            g = v;
            b = t; 
            break;
        case 3: 
            r = p;
            g = q;
            b = v; 
            break;
        case 4: 
            r = t;
            g = p;
            b = v; 
            break;
        case 5: 
            r = v;
            g = p;
            b = q; 
            break;
        default: 
            r = 0;
            g = 0;
            b = 0;
            break;
    };

    return {
        r,
        g,
        b
    };
}