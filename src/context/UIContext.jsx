import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    // State for UI settings
    const [theme, setTheme] = useState('light'); // 'light' | 'dark'
    const [accentColor, setAccentColor] = useState('#2563eb'); // Default Blue
    const [fontSize, setFontSize] = useState('medium'); // 'small' | 'medium' | 'large'

    // Map font size names to pixel values (base size)
    const fontSizes = {
        small: '14px',
        medium: '16px',
        large: '18px'
    };

    // Apply CSS variables whenever state changes
    useEffect(() => {
        const root = document.documentElement;

        // Theme Colors
        if (theme === 'dark') {
            root.style.setProperty('--bg-color-primary', '#111827');
            root.style.setProperty('--bg-color-secondary', '#1f2937');
            root.style.setProperty('--text-color-primary', '#f9fafb');
            root.style.setProperty('--text-color-secondary', '#9ca3af');
            root.style.setProperty('--border-color', '#374151');
        } else {
            root.style.setProperty('--bg-color-primary', '#f9fafb');
            root.style.setProperty('--bg-color-secondary', '#ffffff');
            root.style.setProperty('--text-color-primary', '#111827');
            root.style.setProperty('--text-color-secondary', '#6b7280');
            root.style.setProperty('--border-color', '#e5e7eb');
        }

        // Accent Color
        root.style.setProperty('--primary-color', accentColor);

        // Font Size
        root.style.setProperty('--font-size-base', fontSizes[fontSize]);

    }, [theme, accentColor, fontSize]);

    return (
        <UIContext.Provider value={{ theme, setTheme, accentColor, setAccentColor, fontSize, setFontSize }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
