import globalContext from "../GlobalContext";
import FBO from "../struct/FBO";

export default function drawCheckerboard (target: FBO) {
    globalContext.checkerboardProgram.bind();
    globalContext.gl.uniform1f(globalContext.checkerboardProgram.uniforms.aspectRatio, globalContext.canvas.width / globalContext.canvas.height);
    globalContext.blit(target, false);
}
