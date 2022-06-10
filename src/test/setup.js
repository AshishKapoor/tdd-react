// override react testing library render method
import React from "react";
import { render } from "@testing-library/react";
import AuthContextWrapper from "../state/AuthContextWrapper";
import LanguageSelector from "../components/LanguageSelector";

const RootWrapper = ({ children }) => {
  // TODO: figure out how to use react-router-v6 here.
  return (
    <AuthContextWrapper>
      {children}
      <LanguageSelector />
    </AuthContextWrapper>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: RootWrapper, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
