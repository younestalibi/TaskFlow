class ErrorValidation {
    constructor() {
        this.errors = {};
    }

    getErrors() {
        return this.errors;
    }

    setErrors(response) {
        if (response && response.data && response.data.errors) {
            this.errors = Object.entries(response.data.errors).reduce((acc, [key, value]) => {
                acc[key] = Array.isArray(value) ? value[0] : value; // Take the first element if array
                return acc;
            }, {});
        } else {
            this.errors = {};
        }
    }
}

export default ErrorValidation;
