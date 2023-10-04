import { useContext, useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../context/GlobalContext'
import { useAxios, useLocalStorage } from '../../hooks'
import { AxiosCallData } from '../../types'
import CurrentBalance from './CurrentBalance'

function Authenticated() {
    const [_, __, clearItemInLocal] = useLocalStorage('user-details', '')
    const { balance, setBalance, userDetails, logout } =
        useContext(GlobalContext)
    const navigate = useNavigate()
    const [axiosCallData, setAxiosCallData] = useState<AxiosCallData | null>(
        null,
    )
    const { axiosResponse } = useAxios(
        axiosCallData?.url!,
        axiosCallData?.method!,
        axiosCallData?.params,
        axiosCallData?.token,
    )

    const handleLogout = () => {
        logout()

        clearItemInLocal()

        navigate('/')
    }

    useEffect(() => {
        if (userDetails?.token) {
            setAxiosCallData({
                method: 'GET',
                url: `/user/${userDetails?.id}/balance`,
                token: userDetails?.token,
            })
        }
    }, [userDetails?.token])

    useEffect(() => {
        if (axiosResponse?.data) {
            setBalance(axiosResponse?.data)
        }
    }, [axiosResponse])
    return (
        <>
            <div
                className="d-flex justify-content-between alert alert-info"
                role="alert"
            >
                <div>
                    <h3>Welcome</h3>
                </div>
                <div className="d-flex-column">
                    <CurrentBalance balance={balance} />

                    <div className="d-flex-column">
                        <div className="d-flex justify-content-end ">
                            <button
                                onClick={() => handleLogout()}
                                className="btn btn-secondary"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/authenticated">
                                    Operations
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="/authenticated/operation-records"
                                >
                                    Operation Records
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div>
                <Outlet />
            </div>
        </>
    )
}

export default Authenticated
