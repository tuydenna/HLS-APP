import BaseService from "./base-service";
import {IComment} from "@interfaces/comment";

export default class CommentService extends BaseService<IComment> {

    constructor() {
        super("/comments");
    }

}


