import { useLocation } from "react-router-dom";
import { create } from "zustand";

type ColourTheme = 'light' | 'dark';

interface ColourThemeValues {
  colourTheme: ColourTheme;
}

interface ColourThemeActions {
  setColourTheme: (colourTheme: ColourTheme) => void;
}

const COLOUR_THEME_LOCALSTORAGE_ITEM = '@bitmetro/colour-theme';

export const useColourTheme = create<ColourThemeValues & ColourThemeActions>(set => ({
  colourTheme: localStorage.getItem(COLOUR_THEME_LOCALSTORAGE_ITEM) as ColourTheme || 'light',

  setColourTheme: (colourTheme) => {
    set({ colourTheme });
    localStorage.setItem(COLOUR_THEME_LOCALSTORAGE_ITEM, colourTheme);
  }
}));

export const useGetColourTheme = (): ColourTheme => {
  const { pathname } = useLocation();
  const { colourTheme } = useColourTheme();

  if (pathname.startsWith('/auth')) {
    return 'light';
  }

  return colourTheme;
}
