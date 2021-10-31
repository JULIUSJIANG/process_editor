import globalContext from "../GlobalContext";

export default function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    let program = globalContext.gl.createProgram() as WebGLProgram;
    globalContext.gl.attachShader(program, vertexShader);
    globalContext.gl.attachShader(program, fragmentShader);
    globalContext.gl.linkProgram(program);

    if (!globalContext.gl.getProgramParameter(program, globalContext.gl.LINK_STATUS))
        console.trace(globalContext.gl.getProgramInfoLog(program));

    return program;
}