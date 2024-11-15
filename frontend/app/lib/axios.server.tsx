import Axios, { AxiosError, AxiosResponse } from 'axios';
import ErrorValidation from './custom-error';

const client = Axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        "Content-Type": "application/json"
    },
});

client.interceptors.response.use(
    (response: AxiosResponse) => {
        return response?.data
    },
    (error: AxiosError) => {
        const { response } = error;
        console.log('==============')
        console.log(response?.data)
        console.log('==============')

        if (!response) {
            console.error("Network error or server unreachable");
            return Promise.reject("Network error");
        }

        switch (response.status) {
            case 422: {
                const customError = new ErrorValidation();
                customError.setErrors(response)
                return Promise.reject({
                    status: 422,
                    error: customError,
                });
            }
            case 401:
                return Promise.reject({
                    status: 401,
                    error: response?.data?.error || "Unauthorized, please log in again"
                })
            case 400:
                return Promise.reject({
                    status: 400,
                    error: response?.data?.error || "something is wrong!"
                })
            // case 404:
            //     return Promise.reject("Page not found");
            // case 500:
            //     return Promise.reject("Server error, please try again later");
            default:
                return Promise.reject(error);
        }
    }
);

export default client;
