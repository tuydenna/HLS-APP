import BaseService, {fetchAdapter} from "@services/base-service";
import {IRegisterDto, IUser} from "@interfaces/user";
import {ErrorException} from "@interfaces/error-exeption";

export default class AuthService extends BaseService<IUser> {

    constructor() {
        super("/authentications");
    }

    register(user: IRegisterDto){
        return this.create(user, "register");
    }

    async login(data: { username: string; password: string }) {
        // return this.create(data, "login");
        const res = await fetchAdapter.post("/api/auth/login-proxy", this.getHeaders(), data);
        if (res.ok) {
            return (await res.json()).data;
        }
        throw new ErrorException(res.status, (await res.json()).message);
    }

    logout() {
        return this.update( "logout");
    }

}


