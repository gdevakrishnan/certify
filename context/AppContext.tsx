'use client';
import { createContext } from "react";

interface AppContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const appContext = createContext<AppContextType | undefined>(undefined);

export default appContext;


/*

    the AppContext defines the structure of the context (i.e., the data and functions that will be shared), while the AppContextProvider is the component that provides this context to the rest of the application.

*/