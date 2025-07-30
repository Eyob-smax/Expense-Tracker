import { UserContext } from "../hooks/useUserContext";
type TContextChild = {
  children: React.ReactNode;
};

export default function ContextProvider({ children }: TContextChild) {
  return <UserContext.Provider value={{}}>{children}</UserContext.Provider>;
}
