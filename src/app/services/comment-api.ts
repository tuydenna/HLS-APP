import BaseService from "@app/services/base-service";

export default class CommentService extends BaseService {

    constructor() {
        super("/comments");
    }

}


