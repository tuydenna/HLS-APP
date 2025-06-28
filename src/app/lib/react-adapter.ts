import {EffectCallback, useEffect} from "react";

export function onDidMount(callBack: EffectCallback) {
    return useEffect(callBack, []);
}

export function onDidUpdate(callBack: EffectCallback, dependencies: Array<any> ) {
    return useEffect(callBack, dependencies);
}
