import globalContext from "../GlobalContext";
import UniformParams from "../struct/UniformParams";

export default function getUniforms(program: WebGLProgram): UniformParams {
    let uniforms: WebGLUniformLocation[] = [];
    let uniformCount = globalContext.gl.getProgramParameter(program, globalContext.gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
        let uniformName = (globalContext.gl.getActiveUniform(program, i) as WebGLActiveInfo).name;
        uniforms[uniformName as any] = globalContext.gl.getUniformLocation(program, uniformName) as WebGLUniformLocation;
    }
    return uniforms as any;
}