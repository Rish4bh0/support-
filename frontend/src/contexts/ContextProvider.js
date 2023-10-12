import React, {createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState = {
    chat: false,
    userProfile: false,
    notification:false,
}

export const ContextProvider = ({ children }) => {
    const [activeMenu, setactiveMenu] = useState(true)
    const [isClicked, setisClicked] = useState(initialState);
    const [screenSize, setscreenSize] = useState(undefined)
    const [currentColor, setCurrentColor] = useState('#000000');
    
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
                setColor
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext
(StateContext);