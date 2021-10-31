import Texture from "../struct/Texture";

export default function getTextureScale (texture: Texture, width: number, height: number) {
    return {
        x: width / texture.width,
        y: height / texture.height
    };
}