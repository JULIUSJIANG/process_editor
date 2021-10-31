import globalContext from "../GlobalContext";

export default function step (dt: number) {
    globalContext.gl.disable(globalContext.gl.BLEND);

    globalContext.curlProgram.bind();
    globalContext.gl.uniform2f(globalContext.curlProgram.uniforms.texelSize, globalContext.velocity.texelSizeX, globalContext.velocity.texelSizeY);
    globalContext.gl.uniform1i(globalContext.curlProgram.uniforms.uVelocity, globalContext.velocity.read.attach(0));
    globalContext.blit(globalContext.curl, false);

    globalContext.vorticityProgram.bind();
    globalContext.gl.uniform2f(globalContext.vorticityProgram.uniforms.texelSize, globalContext.velocity.texelSizeX, globalContext.velocity.texelSizeY);
    globalContext.gl.uniform1i(globalContext.vorticityProgram.uniforms.uVelocity, globalContext.velocity.read.attach(0));
    globalContext.gl.uniform1i(globalContext.vorticityProgram.uniforms.uCurl, globalContext.curl.attach(1));
    globalContext.gl.uniform1f(globalContext.vorticityProgram.uniforms.curl, globalContext.config.CURL);
    globalContext.gl.uniform1f(globalContext.vorticityProgram.uniforms.dt, dt);
    globalContext.blit(globalContext.velocity.write, false);
    globalContext.velocity.swap();

    globalContext.divergenceProgram.bind();
    globalContext.gl.uniform2f(globalContext.divergenceProgram.uniforms.texelSize, globalContext.velocity.texelSizeX, globalContext.velocity.texelSizeY);
    globalContext.gl.uniform1i(globalContext.divergenceProgram.uniforms.uVelocity, globalContext.velocity.read.attach(0));
    globalContext.blit(globalContext.divergence, false);

    globalContext.clearProgram.bind();
    globalContext.gl.uniform1i(globalContext.clearProgram.uniforms.uTexture, globalContext.pressure.read.attach(0));
    globalContext.gl.uniform1f(globalContext.clearProgram.uniforms.value, globalContext.config.PRESSURE);
    globalContext.blit(globalContext.pressure.write, false);
    globalContext.pressure.swap();

    globalContext.pressureProgram.bind();
    globalContext.gl.uniform2f(globalContext.pressureProgram.uniforms.texelSize, globalContext.velocity.texelSizeX, globalContext.velocity.texelSizeY);
    globalContext.gl.uniform1i(globalContext.pressureProgram.uniforms.uDivergence, globalContext.divergence.attach(0));
    for (let i = 0; i < globalContext.config.PRESSURE_ITERATIONS; i++) {
        globalContext.gl.uniform1i(globalContext.pressureProgram.uniforms.uPressure, globalContext.pressure.read.attach(1));
        globalContext.blit(globalContext.pressure.write, false);
        globalContext.pressure.swap();
    }

    globalContext.gradienSubtractProgram.bind();
    globalContext.gl.uniform2f(globalContext.gradienSubtractProgram.uniforms.texelSize, globalContext.velocity.texelSizeX, globalContext.velocity.texelSizeY);
    globalContext.gl.uniform1i(globalContext.gradienSubtractProgram.uniforms.uPressure, globalContext.pressure.read.attach(0));
    globalContext.gl.uniform1i(globalContext.gradienSubtractProgram.uniforms.uVelocity, globalContext.velocity.read.attach(1));
    globalContext.blit(globalContext.velocity.write, false);
    globalContext.velocity.swap();

    globalContext.advectionProgram.bind();
    globalContext.gl.uniform2f(globalContext.advectionProgram.uniforms.texelSize, globalContext.velocity.texelSizeX, globalContext.velocity.texelSizeY);
    if (!globalContext.ext.supportLinearFiltering)
        globalContext.gl.uniform2f(globalContext.advectionProgram.uniforms.dyeTexelSize, globalContext.velocity.texelSizeX, globalContext.velocity.texelSizeY);
    let velocityId = globalContext.velocity.read.attach(0);
    globalContext.gl.uniform1i(globalContext.advectionProgram.uniforms.uVelocity, velocityId);
    globalContext.gl.uniform1i(globalContext.advectionProgram.uniforms.uSource, velocityId);
    globalContext.gl.uniform1f(globalContext.advectionProgram.uniforms.dt, dt);
    globalContext.gl.uniform1f(globalContext.advectionProgram.uniforms.dissipation, globalContext.config.VELOCITY_DISSIPATION);
    globalContext.blit(globalContext.velocity.write, false);
    globalContext.velocity.swap();

    if (!globalContext.ext.supportLinearFiltering)
        globalContext.gl.uniform2f(globalContext.advectionProgram.uniforms.dyeTexelSize, globalContext.dye.texelSizeX, globalContext.dye.texelSizeY);
    globalContext.gl.uniform1i(globalContext.advectionProgram.uniforms.uVelocity, globalContext.velocity.read.attach(0));
    globalContext.gl.uniform1i(globalContext.advectionProgram.uniforms.uSource, globalContext.dye.read.attach(1));
    globalContext.gl.uniform1f(globalContext.advectionProgram.uniforms.dissipation, globalContext.config.DENSITY_DISSIPATION);
    globalContext.blit(globalContext.dye.write, false);
    globalContext.dye.swap();
}