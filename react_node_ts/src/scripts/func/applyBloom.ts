import globalContext from "../GlobalContext";
import FBO from "../struct/FBO";
import Texture from "../struct/Texture";

export default function applyBloom (source: FBO, destination: FBO) {
    if (globalContext.bloomFramebuffers.length < 2)
        return;

    let last = destination;

    globalContext.gl.disable(globalContext.gl.BLEND);
    globalContext.bloomPrefilterProgram.bind();
    let knee = globalContext.config.BLOOM_THRESHOLD * globalContext.config.BLOOM_SOFT_KNEE + 0.0001;
    let curve0 = globalContext.config.BLOOM_THRESHOLD - knee;
    let curve1 = knee * 2;
    let curve2 = 0.25 / knee;
    globalContext.gl.uniform3f(globalContext.bloomPrefilterProgram.uniforms.curve, curve0, curve1, curve2);
    globalContext.gl.uniform1f(globalContext.bloomPrefilterProgram.uniforms.threshold, globalContext.config.BLOOM_THRESHOLD);
    globalContext.gl.uniform1i(globalContext.bloomPrefilterProgram.uniforms.uTexture, source.attach(0));
    globalContext.blit(last, false);

    globalContext.bloomBlurProgram.bind();
    for (let i = 0; i < globalContext.bloomFramebuffers.length; i++) {
        let dest = globalContext.bloomFramebuffers[i];
        globalContext.gl.uniform2f(globalContext.bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        globalContext.gl.uniform1i(globalContext.bloomBlurProgram.uniforms.uTexture, last.attach(0));
        globalContext.blit(dest, false);
        last = dest;
    }

    globalContext.gl.blendFunc(globalContext.gl.ONE, globalContext.gl.ONE);
    globalContext.gl.enable(globalContext.gl.BLEND);

    for (let i = globalContext.bloomFramebuffers.length - 2; i >= 0; i--) {
        let baseTex = globalContext.bloomFramebuffers[i];
        globalContext.gl.uniform2f(globalContext.bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        globalContext.gl.uniform1i(globalContext.bloomBlurProgram.uniforms.uTexture, last.attach(0));
        globalContext.gl.viewport(0, 0, baseTex.width, baseTex.height);
        globalContext.blit(baseTex, false);
        last = baseTex;
    }

    globalContext.gl.disable(globalContext.gl.BLEND);
    globalContext.bloomFinalProgram.bind();
    globalContext.gl.uniform2f(globalContext.bloomFinalProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
    globalContext.gl.uniform1i(globalContext.bloomFinalProgram.uniforms.uTexture, last.attach(0));
    globalContext.gl.uniform1f(globalContext.bloomFinalProgram.uniforms.intensity, globalContext.config.BLOOM_INTENSITY);
    globalContext.blit(destination, false);
}