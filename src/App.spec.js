import { render, screen } from "@testing-library/react";
import App from "./App";

describe("Routing", () => {
  // it("displays homepage at /", () => {
  //   render(<App />);
  //   const homepage = screen.getByTestId("home-page");
  //   expect(homepage).toBeInTheDocument();
  // });

  // it("does not display SignUpPage when at /", () => {
  //   render(<App />);
  //   const page = screen.queryByTestId("sign-up-page");
  //   expect(page).not.toBeInTheDocument();
  // });

  // it("displays signup page at /signup", () => {
  //   window.history.pushState({}, "", "/signup");
  //   render(<App />);
  //   const page = screen.queryByTestId("sign-up-page");
  //   expect(page).toBeInTheDocument();
  // });

  // it("does not display homepage when at /signup", () => {
  //   window.history.pushState({}, "", "/signup");
  //   render(<App />);
  //   const page = screen.queryByTestId("home-page");
  //   expect(page).not.toBeInTheDocument();
  // });
  it.each`
    path         | pageTestId
    ${"/"}       | ${"home-page"}
    ${"/signup"} | ${"sign-up-page"}
    ${"/login"} | ${"login-page"}
  `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
    window.history.pushState({}, "", path);
    render(<App />);
    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
    path         | pageTestId
    ${"/"}       | ${"sign-up-page"}
    ${"/signup"} | ${"home-page"}
  `(
    "does not display $pageTestId when path is $path",
    ({ path, pageTestId }) => {
      window.history.pushState({}, "", path);
      render(<App />);
      const page = screen.queryByTestId(pageTestId);
      expect(page).not.toBeInTheDocument();
    }
  );
});
