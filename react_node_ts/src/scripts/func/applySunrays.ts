import globalContext from "../GlobalContext";
import FBO from "../struct/FBO";

export default function applySunrays (source: FBO, mask: FBO, destination: FBO) {
    globalContext.gl.disable(globalContext.gl.BLEND);
    globalContext.sunraysMaskProgram.bind();
    globalContext.gl.uniform1i(globalContext.sunraysMaskProgram.uniforms.uTexture, source.attach(0));
    globalContext.blit(mask, false);

    globalContext.sunraysProgram.bind();
    globalContext.gl.uniform1f(globalContext.sunraysProgram.uniforms.weight, globalContext.config.SUNRAYS_WEIGHT);
    globalContext.gl.uniform1i(globalContext.sunraysProgram.uniforms.uTexture, mask.attach(0));
    globalContext.blit(destination, false);
}