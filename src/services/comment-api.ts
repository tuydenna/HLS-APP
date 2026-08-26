import BaseService from "./base-service";
import {IComment} from "@interfaces/comment";
import {RouteProxyConfig} from "@constant/route-proxy-config";

export default class CommentService extends BaseService<IComment> {

    constructor() {
        super("/comments", RouteProxyConfig.API_POXY);
    }

}


