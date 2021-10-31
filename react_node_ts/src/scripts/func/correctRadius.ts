import globalContext from "../GlobalContext";

    export default function correctRadius (radius: number) {
        let aspectRatio = globalContext.canvas.width / globalContext.canvas.height;
        if (aspectRatio > 1)
            radius *= aspectRatio;
        return radius;
    }