import globalContext from "../GlobalContext";
import Color from "../struct/Color";
import FBO from "../struct/FBO";

export default function drawColor (target: FBO, color: Color) {
    globalContext.colorProgram.bind();
    globalContext.gl.uniform4f(globalContext.colorProgram.uniforms.color, color.r, color.g, color.b, 1);
    globalContext.blit(target, false);
}