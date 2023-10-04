import { FormEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../context/GlobalContext'
import { AxiosCallData, UserDetails } from '../../types/types.d'
import { useAxios, useLocalStorage } from '../../hooks'
import { SimpleAlert } from '../common'

function Login() {
    const [axiosCallData, setAxiosCallData] = useState<AxiosCallData | null>(
        null,
    )
    const navigate = useNavigate()
    const { axiosResponse, axiosError } = useAxios(
        axiosCallData?.url!,
        axiosCallData?.method!,
        axiosCallData?.params,
    )
    const [itemInLocal, setItemInLocal] = useLocalStorage('user-details', '')
    const { userDetails, setUserDetails } = useContext(GlobalContext)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setErrorMsg('')

        if (username && password) {
            setAxiosCallData({
                method: 'POST',
                url: '/auth/login',
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
            setUserDetails(axiosResponse?.data)

            setItemInLocal(axiosResponse?.data)
        }
    }, [axiosResponse])

    useEffect(() => {
        const userDetailsItem = itemInLocal as UserDetails
        if (userDetailsItem.token) {
            navigate('/authenticated')
        }
    }, [itemInLocal])
    return (
        <div className="d-flex-column mx-auto col-md-6  ">
            <div className="">
                <div className="card">
                    <div className="card-header d-flex  justify-content-center ">
                        <h3>Login to your account</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={e => handleSubmit(e)}>
                            <div className="form-group mt-2">
                                <label
                                    className="text-muted"
                                    aria-label="userEmailInput"
                                >
                                    Email address
                                </label>
                                <input
                                    onChange={e => setUsername(e.target.value)}
                                    type="email"
                                    className="form-control"
                                    id="userEmailInput"
                                    data-testid="user-email"
                                    aria-describedby="emailHelp"
                                    placeholder="Enter email"
                                />{' '}
                            </div>
                            <div className="form-group mt-2">
                                <label
                                    className="text-muted"
                                    aria-label="userPasswordInput"
                                >
                                    Password
                                </label>
                                <input
                                    onChange={e => setPassword(e.target.value)}
                                    type="password"
                                    className="form-control"
                                    id="userPasswordInput"
                                    data-testid="user-password"
                                    placeholder="Password"
                                />{' '}
                            </div>

                            <button
                                data-testid="submit"
                                type="submit"
                                className="btn btn-primary mt-4"
                            >
                                Submit
                            </button>
                        </form>
                        <div className="d-flex col-md-12 justify-content-end">
                            <Link to={'/register'}>Register</Link>
                        </div>
                    </div>
                </div>
            </div>

            {errorMsg && axiosResponse && (
                <SimpleAlert message={errorMsg} status={axiosResponse.status} />
            )}
        </div>
    )
}

export default Login
