import Axios, { AxiosError, AxiosResponse } from 'axios';
import ErrorValidation from './custom-error';

const client = Axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        "Content-Type": "application/json"
    },
});

client.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(response?.data)
        return response?.data
    },
    (error: AxiosError) => {
        const { response } = error;
        console.log('==============')
        console.log('press'+process.env.BASE_URL)
        console.log('press'+ import.meta.env.VITE_BASE_URL)
        console.log(response?.data)
        console.log(response?.status)
        console.log(response?.data?.error)
        console.log('==============')
        console.log(process.env.BASE_URL)

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
            case 404:
                return Promise.reject({
                    status: 400,
                    error: response?.data?.error || "Not Found"
                })
            // case 500:
            //     return Promise.reject("Server error, please try again later");
            default:
                return Promise.reject(error);
        }
    }
);

export default client;
