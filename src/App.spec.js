import { render, screen } from "@testing-library/react";
import { setupWorker } from "msw";
import App from "./App";

describe("Routing", () => {
  const setup = (path) => {
    window.history.pushState({}, "", path);
    render(<App />);
  }
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
    ${"/login"}  | ${"login-page"}
    ${"/user/1"} | ${"user-page"}
    ${"/user/2"} | ${"user-page"}
  `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
    setup(path);

    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
    path         | pageTestId
    ${"/"}       | ${"sign-up-page"}
    ${"/"}       | ${"login-page"}
    ${"/"}       | ${"user-page"}
    ${"/signup"} | ${"home-page"}
    ${"/signup"} | ${"login-page"}
    ${"/signup"} | ${"user-page"}
    ${"/login"}  | ${"home-page"}
    ${"/login"}  | ${"signup-page"}
    ${"/login"}  | ${"user-page"}
    ${"/user/1"} | ${"home-page"}
    ${"/user/1"} | ${"sign-up-page"}
    ${"/user/1"} | ${"login-page"}
  `(
    "does not display $pageTestId when path is $path",
    ({ path, pageTestId }) => {
      setup(path);

      const page = screen.queryByTestId(pageTestId);
      expect(page).not.toBeInTheDocument();
    }
  );
});
