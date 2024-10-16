class CustomError extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
        this.status = `${this.statusCode}`.startsWith('4') ? 'error' : 'fail'
        this.isOperationalError = true
    }
}

module.exports = CustomError