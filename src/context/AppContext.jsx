import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [toast, setToast] = useState("");

  return (
    <AppContext.Provider value={{ toast, setToast }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
