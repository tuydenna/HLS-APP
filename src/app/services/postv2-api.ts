import BaseService from "@app/services/base-service";

export default class PostService extends BaseService {

    constructor() {
        super("/posts");
    }

}


