import {EffectCallback, useEffect} from "react";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export function onDidMount(callBack: EffectCallback) {
    return useEffect(callBack, []);
}

export function onDidUpdate(callBack: EffectCallback, dependencies: Array<any> ) {
    return useEffect(callBack, dependencies);
}

export function redirectTo(router: AppRouterInstance, routesList: string) {
    return router.push(routesList);
}