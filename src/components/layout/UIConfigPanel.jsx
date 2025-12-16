import React from 'react';
import { useUI } from "../../context/UIContext";

const UIConfigPanel = () => {
    const { theme, setTheme, accentColor, setAccentColor, fontSize, setFontSize } = useUI();

    const colors = [
        { name: 'Blue', value: '#2563eb' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Green', value: '#10b981' },
        { name: 'Purple', value: '#8b5cf6' },
        { name: 'Orange', value: '#f97316' }
    ];

    return (
        <div style={{
            background: 'var(--bg-color-secondary)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            color: 'var(--text-color-primary)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600 }}>UI Configuration</h3>

            {/* Theme Toggle */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-color-secondary)' }}>
                    Theme Mode
                </label>
                <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-color-primary)', padding: '4px', borderRadius: '6px' }}>
                    <button
                        onClick={() => setTheme('light')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: theme === 'light' ? 'var(--bg-color-secondary)' : 'transparent',
                            color: theme === 'light' ? 'var(--primary-color)' : 'var(--text-color-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        Light
                    </button>
                    <button
                        onClick={() => setTheme('dark')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: theme === 'dark' ? 'var(--bg-color-secondary)' : 'transparent',
                            color: theme === 'dark' ? 'var(--primary-color)' : 'var(--text-color-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: theme === 'dark' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        Dark
                    </button>
                </div>
            </div>

            {/* Accent Color */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-color-secondary)' }}>
                    Accent Color
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {colors.map((c) => (
                        <button
                            key={c.name}
                            onClick={() => setAccentColor(c.value)}
                            title={c.name}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: c.value,
                                border: `2px solid ${accentColor === c.value ? 'var(--text-color-primary)' : 'transparent'}`,
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    ))}
                </div>
            </div>

            {/* Font Size */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-color-secondary)' }}>
                    Font Size
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['small', 'medium', 'large'].map((size) => (
                        <button
                            key={size}
                            onClick={() => setFontSize(size)}
                            style={{
                                flex: 1,
                                padding: '8px',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                background: fontSize === size ? 'var(--primary-color)' : 'transparent',
                                color: fontSize === size ? '#fff' : 'var(--text-color-primary)',
                                textTransform: 'capitalize',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UIConfigPanel;
