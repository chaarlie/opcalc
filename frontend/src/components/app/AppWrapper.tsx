import App from './App'
import { GlobalProvider } from '../../context/GlobalContext'

function AppWrapper() {
    return (
        <GlobalProvider>
            <App />
        </GlobalProvider>
    )
}

export default AppWrapper
