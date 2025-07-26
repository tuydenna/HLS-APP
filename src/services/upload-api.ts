import BaseService from "./base-service";
import {IFileUpload} from "@interfaces/video";

export default class FileService extends BaseService<IFileUpload> {

    constructor() {
        super("/files");
    }

}


