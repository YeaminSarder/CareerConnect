import { createContext, useReducer } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload }
        case 'LOGOUT':
            return { ...state, user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const initialState = {
        user: null,
    }

    const [state, dispatch] = useReducer(authReducer, initialState)
    console.log('AuthContext state:', state) // Log the state to see if it's updating correctly
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}