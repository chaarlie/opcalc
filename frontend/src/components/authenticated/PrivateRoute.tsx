import { Navigate } from 'react-router-dom'
import Authenticated from './Authenticated'

interface PrivateRouteProps {
    isAuthenticated: boolean
}
function PrivateRoute({ isAuthenticated }: PrivateRouteProps) {
    return isAuthenticated ? <Authenticated /> : <Navigate to="/login" />
}

export default PrivateRoute
