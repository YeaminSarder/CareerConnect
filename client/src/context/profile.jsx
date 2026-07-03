import { createContext, useReducer } from "react";

export const ProfileContext = createContext(null);
export const profileReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROFILE":
      return { ...state, profile: action.payload };
    case "DELETE_PROFILE":
      return { ...state, profile: state.profile.filter((p) => p._id !== action.payload._id) };
    case "CREATE_PROFILE":
      return { ...state, profile: [action.payload, ...state.profile] };
    default:
      return state;
  }
};
const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, {
    profile: [],
  });
  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;