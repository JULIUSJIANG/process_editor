import globalContext from "../GlobalContext";
import FBO from "../struct/FBO";
import getTextureScale from "./getTextureScale";

export default function drawDisplay (target: FBO) {
    let width = target == null ? globalContext.gl.drawingBufferWidth : target.width;
    let height = target == null ? globalContext.gl.drawingBufferHeight : target.height;

    globalContext.displayMaterial.bind();
    if (globalContext.config.SHADING)
        globalContext.gl.uniform2f(globalContext.displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
    globalContext.gl.uniform1i(globalContext.displayMaterial.uniforms.uTexture, globalContext.dye.read.attach(0));
    if (globalContext.config.BLOOM) {
        globalContext.gl.uniform1i(globalContext.displayMaterial.uniforms.uBloom, globalContext.bloom.attach(1));
        globalContext.gl.uniform1i(globalContext.displayMaterial.uniforms.uDithering, globalContext.ditheringTexture.attach(2));
        let scale = getTextureScale(globalContext.ditheringTexture, width, height);
        globalContext.gl.uniform2f(globalContext.displayMaterial.uniforms.ditherScale, scale.x, scale.y);
    }
    if (globalContext.config.SUNRAYS)
        globalContext.gl.uniform1i(globalContext.displayMaterial.uniforms.uSunrays, globalContext.sunrays.attach(3));
        globalContext.blit(target, false);
}