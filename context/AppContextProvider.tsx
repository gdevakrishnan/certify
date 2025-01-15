'use client';
import React, { useState, ReactNode } from 'react';
import appContext from './AppContext';

interface AppContextProviderProps {
    children: ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [theme, setTheme] = useState<string>('light');

    const context = {
        theme,
        setTheme
    };

    return (
        <appContext.Provider value={context}>
            {children}
        </appContext.Provider>
    );
};

export default AppContextProvider;
