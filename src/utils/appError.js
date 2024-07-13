export class AppError extends Error {
    //constructor
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode;
    }
}