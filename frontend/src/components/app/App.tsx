import { useContext, Fragment } from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { Route, Routes, Navigate } from 'react-router-dom'
import { GlobalContext } from '../../context/GlobalContext'
import { Operation } from '../operation'
import { OperationRecords } from '../operation-records'
import { Login } from '../login'
import { Register } from '../register'
import { PrivateRoute } from '../authenticated'

interface AppProps {
    url?: string
}
function App({ url = '/' }: AppProps) {
    const { userDetails } = useContext(GlobalContext)

    const token = userDetails?.token
    return (
        <div data-testid="app-container" className="container container-styles">
            <Router initialEntries={[url]}>
                <Fragment>
                    <Routes>
                        <Route path="/">
                            <Route
                                index
                                element={
                                    Boolean(token) ? (
                                        <Navigate to="/authenticated" />
                                    ) : (
                                        <Navigate to="/login" />
                                    )
                                }
                            />
                            <Route
                                path="/authenticated"
                                element={<PrivateRoute />}
                            >
                                <Route index element={<Operation />} />
                                <Route
                                    path="/authenticated/operation"
                                    element={<Operation />}
                                />
                                <Route
                                    path="/authenticated/operation-records"
                                    element={<OperationRecords />}
                                />
                            </Route>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>
                    </Routes>
                </Fragment>
            </Router>
        </div>
    )
}

export default App
