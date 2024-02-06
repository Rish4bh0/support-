import React, {createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState = {
    chat: false,
    userProfile: false,
    notification:false,
    activeMenu:true
}

export const ContextProvider = ({ children }) => {
    const [activeMenu, setactiveMenu] = useState(true)
    const [isClicked, setisClicked] = useState(initialState);
    const [screenSize, setscreenSize] = useState(undefined)
    const [currentColor, setCurrentColor] = useState('#03C9D7');
    const [currentMode, setCurrentMode] = useState('Light');


    const setMode = (e) => {
        setCurrentMode(e.target.value);
        localStorage.setItem('themeMode', e.target.value);
      };

    const setColor = (color) => {
        setCurrentColor(color);
        localStorage.setItem('colorMode', color);
      };

    
    const handleClick = (clicked) => {
        setisClicked({...initialState, [clicked]:true});
    }
    return(
        <StateContext.Provider
            value={{
                activeMenu,
                setactiveMenu,
                isClicked,
                setisClicked,
                handleClick,
                screenSize,
                setscreenSize,
                currentColor,
                setCurrentColor,
                setColor, 
                currentMode,
                setMode
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext
(StateContext);