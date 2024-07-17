import React, { useState, useEffect } from 'react';
import { Theme } from '@/themes/enum'; // Import enum dan fungsi sesuai kebutuhan
import { getPreferredTheme } from '@/themes/theme'; // Import enum dan fungsi sesuai kebutuhan

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(getPreferredTheme());

  const toggleTheme = () => {
    const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light;
    setTheme(newTheme);
    document.cookie = `theme=${newTheme}; path=/`; // Simpan ke cookie
    window.location.reload(); // Reload untuk menerapkan tema baru
  };

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', theme);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#5D5C61',
        color: 'white',
        cursor: 'pointer',
        zIndex: 4,
      }}
    >
      {theme === Theme.Light ? 'Switch to Dark' : 'Switch to Light'}
    </button>
  );
};

export default ThemeToggle;
