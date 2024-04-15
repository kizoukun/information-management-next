"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ContextProps {
   sidebar: boolean;
   toggleSidebar: () => void;
}

const GlobalContext = createContext<ContextProps>({
   sidebar: true,
   toggleSidebar: () => {},
});

export const GlobalContextProvider = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const [sidebar, setSidebar] = useState(true);
   useEffect(() => {
      const width = window.innerWidth;
      if (width < 1024) {
         setSidebar(false);
      }
   }, []);
   const toggleSidebar = () => {
      setSidebar(!sidebar);
   };
   return (
      <GlobalContext.Provider value={{ sidebar, toggleSidebar }}>
         {children}
      </GlobalContext.Provider>
   );
};

export const useGlobalContext = () => useContext(GlobalContext);
