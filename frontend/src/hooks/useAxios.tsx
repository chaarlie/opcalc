import { useState, useEffect } from 'react'
import { AxiosError, AxiosResponse, Method } from 'axios'
import { axiosInstance } from '../config'

const useAxios = (
    url: string,
    method: Method,
    params?: any,
    token?: string,
) => {
    const [axiosResponse, setAxiosResponse] = useState<AxiosResponse | null>(
        null,
    )
    const [isLoading, setIsLoading] = useState(true)
    const [axiosError, setAxiosError] = useState<AxiosError | null>(null)

    useEffect(() => {
        if (url) {
            let promiseResult = null
            switch (method.toLocaleLowerCase()) {
                case 'get':
                    promiseResult = axiosInstance(token).get(url)
                    break
                case 'post':
                    promiseResult = axiosInstance(token).post(url, params)
                    break
                case 'delete':
                    promiseResult = axiosInstance(token).delete(url, params)
                    break
            }

            promiseResult
                ?.then((response: AxiosResponse) => {
                    setAxiosResponse(response)
                })
                .catch(error => setAxiosError(error))
                .finally(() => setIsLoading(false))
        }
    }, [url])

    return { axiosResponse, isLoading, axiosError }
}

export default useAxios
