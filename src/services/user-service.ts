import BaseService from "./base-service";
import {IUser} from "@interfaces/user";
import {RouteProxyConfig} from "@constant/route-proxy-config";

export default class UserService extends BaseService<IUser> {

    constructor() {
        super("/users", RouteProxyConfig.API_POXY);
    }

}


