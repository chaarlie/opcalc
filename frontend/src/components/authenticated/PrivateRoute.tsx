import { Navigate } from 'react-router-dom'
import Authenticated from './Authenticated'
import { useContext, useEffect } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import { useLocalStorage } from '../../hooks'
import { UserDetails } from '../../types'

function PrivateRoute() {
    const { userDetails, setUserDetails } = useContext(GlobalContext)
    const [itemInLocal, _] = useLocalStorage('user-details', '')

    useEffect(() => {
        setUserDetails(itemInLocal as UserDetails)
    }, [itemInLocal])

    return (
        <>
            {userDetails && userDetails?.token ? (
                <Authenticated />
            ) : (
                <Navigate to="/login" />
            )}
        </>
    )
}

export default PrivateRoute
