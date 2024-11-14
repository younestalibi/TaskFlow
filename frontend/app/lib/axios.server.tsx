import Axios, { AxiosError, AxiosResponse } from 'axios';

const client = Axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        "Content-Type": "application/json"
    },
});

client.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error: AxiosError) => {
        console.log(error.response);
        if (!error.response) {
            return Promise.reject(error);
        }

        if (error.response.status === 401) {

            return Promise.reject(error.response);
        }

        return Promise.reject(error.response);
    }
);

export default client;
