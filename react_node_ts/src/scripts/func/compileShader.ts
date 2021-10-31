import globalContext from "../GlobalContext";
import addKeywords from "./addKeywords";

export default function compileShader(type: number, source: string, keywords: string[]) {
    source = addKeywords(source, keywords);

    const shader = globalContext.gl.createShader(type) as WebGLShader;
    globalContext.gl.shaderSource(shader, source);
    globalContext.gl.compileShader(shader);

    if (!globalContext.gl.getShaderParameter(shader, globalContext.gl.COMPILE_STATUS))
        console.trace(globalContext.gl.getShaderInfoLog(shader));

    return shader;
};