import globalContext from "../GlobalContext";
import FBO from "../struct/FBO";

export default function blur (target: FBO, temp: FBO, iterations: number) {
    globalContext.blurProgram.bind();
    for (let i = 0; i < iterations; i++) {
        globalContext.gl.uniform2f(globalContext.blurProgram.uniforms.texelSize, target.texelSizeX, 0.0);
        globalContext.gl.uniform1i(globalContext.blurProgram.uniforms.uTexture, target.attach(0));
        globalContext.blit(temp, false);

        globalContext.gl.uniform2f(globalContext.blurProgram.uniforms.texelSize, 0.0, target.texelSizeY);
        globalContext.gl.uniform1i(globalContext.blurProgram.uniforms.uTexture, temp.attach(0));
        globalContext.blit(target, false);
    }
}