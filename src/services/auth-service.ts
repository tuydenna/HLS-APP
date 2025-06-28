import BaseService from "@services/base-service";
import {IUser} from "@interfaces/user";

export default class AuthService extends BaseService<IUser> {

    constructor() {
        super("/authentications");
    }

    register(user) {
        return this.create(user, "register");
    }

}


