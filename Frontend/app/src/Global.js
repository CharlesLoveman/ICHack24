import React, { useState, useEffect, useLayoutEffect } from 'react';

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

//const isMobile = useMediaQuery({ query: '(max-width: 1000px)' });

export default function useWindowStyle() {
    const [windowStyle, setWindowStyle] = useState(true);


    return windowStyle;
}
