import BaseService from "@services/base-service";
import {IUser} from "@interfaces/user";

export default class AuthService extends BaseService<IUser> {

    constructor() {
        super("/authentications");
    }

    register(user: IUser){
        return this.create(user, "register");
    }

    login(data: {username: string; password: string}) {
        return this.create(data, "login");
    }

    logout() {
        return this.update( "logout");
    }

}


