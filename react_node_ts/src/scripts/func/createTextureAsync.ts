import globalContext from "../GlobalContext";
import Texture from "../struct/Texture";

export default function createTextureAsync(url: string): Texture {
    let texture = globalContext.gl.createTexture() as WebGLTexture;
    globalContext.gl.bindTexture(globalContext.gl.TEXTURE_2D, texture);
    globalContext.gl.texParameteri(globalContext.gl.TEXTURE_2D, globalContext.gl.TEXTURE_MIN_FILTER, globalContext.gl.LINEAR);
    globalContext.gl.texParameteri(globalContext.gl.TEXTURE_2D, globalContext.gl.TEXTURE_MAG_FILTER, globalContext.gl.LINEAR);
    globalContext.gl.texParameteri(globalContext.gl.TEXTURE_2D, globalContext.gl.TEXTURE_WRAP_S, globalContext.gl.REPEAT);
    globalContext.gl.texParameteri(globalContext.gl.TEXTURE_2D, globalContext.gl.TEXTURE_WRAP_T, globalContext.gl.REPEAT);
    globalContext.gl.texImage2D(globalContext.gl.TEXTURE_2D, 0, globalContext.gl.RGB, 1, 1, 0, globalContext.gl.RGB, globalContext.gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));

    let obj = {
        texture,
        width: 1,
        height: 1,
        attach(id: number) {
            globalContext.gl.activeTexture(globalContext.gl.TEXTURE0 + id);
            globalContext.gl.bindTexture(globalContext.gl.TEXTURE_2D, texture);
            return id;
        }
    };

    let image = new Image();
    image.onload = () => {
        obj.width = image.width;
        obj.height = image.height;
        globalContext.gl.bindTexture(globalContext.gl.TEXTURE_2D, texture);
        globalContext.gl.texImage2D(globalContext.gl.TEXTURE_2D, 0, globalContext.gl.RGB, globalContext.gl.RGB, globalContext.gl.UNSIGNED_BYTE, image);
    };
    image.src = url;

    return obj;
}