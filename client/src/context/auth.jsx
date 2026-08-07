import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload, isLoading: false }
        case 'LOGOUT':
            return { ...state, user: null, isLoading: false }
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const initialState = {
        user: null,
        isLoading: true
    }
    const [state, dispatch] = useReducer(authReducer, initialState)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            dispatch({ type: 'LOGIN', payload: user })
        } else {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }, [])

    console.log('AuthContext state:', state) // Log the state to see if it's updating correctly
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}