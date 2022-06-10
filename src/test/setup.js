// override react testing library render method
import React from "react";
import { render } from "@testing-library/react";
import AuthContextWrapper from "../state/AuthContextWrapper";

const RootWrapper = ({ children }) => {
  return <AuthContextWrapper>{children}</AuthContextWrapper>;
};

const customRender = (ui, options) =>
  render(ui, { wrapper: RootWrapper, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
