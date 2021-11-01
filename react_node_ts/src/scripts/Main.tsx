import React from "react";
import globalContext from "./GlobalContext";
export default class Main extends React.Component {
    public override componentDidMount () {
        globalContext.init(document.getElementsByTagName("canvas")[0]);
    }
    public override render() {
        return <canvas style={{ width: `100%`, height: `100%` }}></canvas>;
    }
}