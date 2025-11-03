import React from "react";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useColourTheme } from "../../state/theme";

export const ColourThemeSwitch: React.FC = () => {
  const { colourTheme, setColourTheme } = useColourTheme();

  return (
    <DarkModeSwitch
      size={20}
      style={{ marginBottom: -5, marginRight: 10 }}
      moonColor="#1e85eb"
      sunColor="#fad78c"
      checked={colourTheme === 'dark'}
      onChange={(checked) => setColourTheme(checked ? 'dark' : 'light')}
    />
  )
}
