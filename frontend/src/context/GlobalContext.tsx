import { ReactNode, createContext, useReducer } from 'react'
import { GlobalContextState, UserDetails } from '../types'

const initialState: GlobalContextState = {
    userDetails: null,
    balance: 0,
    setUserDetails: (userDetails: UserDetails) => {},
    setBalance: (balance: number) => {},
    logout: () => {},
}

export const GlobalContext = createContext(initialState)

const AppReducer = (
    state: GlobalContextState,
    action: { type: string; payload: any },
) => {
    switch (action.type) {
        case 'SET_USER_DETAILS':
            return {
                ...state,
                userDetails: action.payload,
            }
        case 'SET_BALANCE':
            return {
                ...state,
                balance: action.payload,
            }
        case 'REMOVE_USER_DETAILS':
            return {
                ...state,
                userDetails: action.payload,
            }
        default:
            return state
    }
}

interface GlobalProviderProps {
    children: ReactNode
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const [state, dispatch] = useReducer(AppReducer, initialState)

    const setUserDetails = (userDetails: UserDetails) => {
        dispatch({
            type: 'SET_USER_DETAILS',
            payload: userDetails,
        })
    }

    const setBalance = (balance: number) => {
        dispatch({
            type: 'SET_BALANCE',
            payload: balance,
        })
    }

    const logout = () => {
        dispatch({
            type: 'REMOVE_USER_DETAILS',
            payload: null,
        })
    }

    return (
        <GlobalContext.Provider
            value={{
                userDetails: state.userDetails,
                balance: state.balance,
                setBalance,
                logout,
                setUserDetails,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
