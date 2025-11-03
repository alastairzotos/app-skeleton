import React, { createContext, useContext } from "react";
import { createPortal } from "react-dom";

interface Props {
  ref?: React.RefObject<HTMLDivElement | null>;
}

const ToolbarContext = createContext<Props>({});

export const ToolbarContextProvider = ToolbarContext.Provider;

export const useToolbar = () => useContext(ToolbarContext);

export const ToolbarContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { ref } = useToolbar();

  if (!ref?.current) return;

  return createPortal(children, ref.current);
}
