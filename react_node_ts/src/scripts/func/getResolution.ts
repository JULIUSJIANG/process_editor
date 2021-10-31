import globalContext from "../GlobalContext";

export function getResolution (resolution: number) {
    let aspectRatio = globalContext.gl.drawingBufferWidth / globalContext.gl.drawingBufferHeight;
    if (aspectRatio < 1)
        aspectRatio = 1.0 / aspectRatio;

    let min = Math.round(resolution);
    let max = Math.round(resolution * aspectRatio);

    if (globalContext.gl.drawingBufferWidth > globalContext.gl.drawingBufferHeight)
        return { width: max, height: min };
    else
        return { width: min, height: max };
}