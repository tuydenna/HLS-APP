export class  ErrorException  extends Error {
    code: number = 400;
    constructor(code: number, message: string) {
        super();
        this.code = code;
        this.message = message;
    }
}