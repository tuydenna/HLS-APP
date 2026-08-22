import BaseService from "./base-service";
import {IUser} from "@interfaces/user";

export default class UserService extends BaseService<IUser> {

    constructor() {
        super("/users", "/api/backend-proxy");
    }

}


