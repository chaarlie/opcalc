import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AxiosCallData } from '../../types/types.d'
import { useAxios } from '../../hooks'
import { SimpleAlert } from '../common'

function Register() {
    const [axiosCallData, setAxiosCallData] = useState<AxiosCallData | null>(
        null,
    )

    const { axiosResponse, axiosError } = useAxios(
        axiosCallData?.url!,
        axiosCallData?.method!,
        axiosCallData?.params,
    )
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [isNewAccountCreated, setIsNewAccountCreated] =
        useState<boolean>(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setErrorMsg('')
        setIsNewAccountCreated(false)

        if (username && password) {
            setAxiosCallData({
                method: 'POST',
                url: '/auth/signup',
                params: { username, password },
            })
        }
    }

    useEffect(() => {
        if (axiosError) {
            setErrorMsg(axiosError?.message)
            setAxiosCallData(null)
        }
    }, [axiosError])

    useEffect(() => {
        if (axiosResponse && axiosResponse.status === 200) {
            setIsNewAccountCreated(true)
        }
    }, [axiosResponse])

    return (
        <div className="d-flex-column mx-auto col-md-6  ">
            <div className="">
                <div className="card">
                    <div className="card-header d-flex  justify-content-center ">
                        <h3>Create a New Account</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={e => handleSubmit(e)}>
                            <div className="form-group mt-2">
                                <label
                                    className="text-muted"
                                    aria-label="exampleInputEmail1"
                                >
                                    Email address
                                </label>
                                <input
                                    onChange={e => setUsername(e.target.value)}
                                    type="email"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    placeholder="Enter email"
                                />{' '}
                            </div>
                            <div className="form-group mt-2">
                                <label
                                    className="text-muted"
                                    aria-label="exampleInputPassword1"
                                >
                                    Password
                                </label>
                                <input
                                    onChange={e => setPassword(e.target.value)}
                                    type="password"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    placeholder="Password"
                                />{' '}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary mt-4"
                            >
                                Submit
                            </button>
                        </form>
                        <div className="d-flex col-md-12 justify-content-end">
                            <Link to={'/login'}>Login</Link>
                        </div>
                    </div>
                </div>
            </div>

            {axiosResponse && isNewAccountCreated && (
                <SimpleAlert
                    message={'Account Created'}
                    status={axiosResponse.status}
                />
            )}

            {axiosError && axiosResponse && (
                <SimpleAlert message={errorMsg} status={axiosResponse.status} />
            )}
        </div>
    )
}

export default Register
