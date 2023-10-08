import { useState, useEffect, SetStateAction } from 'react'
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
            const invokedMethod = method.toLowerCase()
            //@ts-ignore
            axiosInstance(token)
                [invokedMethod](url, params)
                ?.then((response: AxiosResponse) => {
                    setAxiosResponse(response)
                })
                .catch(
                    (error: SetStateAction<AxiosError<unknown, any> | null>) =>
                        setAxiosError(error),
                )
                .finally(() => setIsLoading(false))
        }
    }, [url])

    return { axiosResponse, isLoading, axiosError }
}

export default useAxios
