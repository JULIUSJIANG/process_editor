import FBO from "./FBO";

export default class DoubleFBO {
    width: number;;
    height: number;;
    texelSizeX: number;;
    texelSizeY: number;;
    read: FBO;;
    write: FBO;;
    swap: () => void;;
}