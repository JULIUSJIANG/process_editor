import globalContext from "../GlobalContext";
import FBO from "../struct/FBO";
import createFBO from "./createFBO";

export  default   function resizeFBO (target: FBO, w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
    let newFBO = createFBO(w, h, internalFormat, format, type, param);
    globalContext.copyProgram.bind();
    globalContext.gl.uniform1i(globalContext.copyProgram.uniforms.uTexture, target.attach(0));
    globalContext.blit(newFBO, false);
    return newFBO;
}