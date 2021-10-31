import globalContext from "../GlobalContext";
import Color from "../struct/Color";
import correctRadius from "./correctRadius";

    export default function splat (x: number, y: number, dx: number, dy: number, color: Color) {
        globalContext.splatProgram.bind();
        globalContext.gl.uniform1i(globalContext.splatProgram.uniforms.uTarget, globalContext.velocity.read.attach(0));
        globalContext.gl.uniform1f(globalContext.splatProgram.uniforms.aspectRatio, globalContext.canvas.width / globalContext.canvas.height);
        globalContext.gl.uniform2f(globalContext.splatProgram.uniforms.point, x, y);
        globalContext.gl.uniform3f(globalContext.splatProgram.uniforms.color, dx, dy, 0.0);
        globalContext.gl.uniform1f(globalContext.splatProgram.uniforms.radius, correctRadius(globalContext.config.SPLAT_RADIUS / 100.0));
        globalContext.blit(globalContext.velocity.write, false);
        globalContext.velocity.swap();
    
        globalContext.gl.uniform1i(globalContext.splatProgram.uniforms.uTarget, globalContext.dye.read.attach(0));
        globalContext.gl.uniform3f(globalContext.splatProgram.uniforms.color, color.r, color.g, color.b);
        globalContext.blit(globalContext.dye.write, false);
        globalContext.dye.swap();
    }