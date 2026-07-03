import { useContext } from "react";
import { ProfileContext } from "../context/profile";

const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export default useProfileContext;