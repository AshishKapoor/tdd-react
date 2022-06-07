import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("Routing", () => {
  const setup = (path) => {
    window.history.pushState({}, "", path);
    render(<App />);
  };
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
    ${"/users/1"} | ${"users-page"}
    ${"/users/2"} | ${"users-page"}
  `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
    setup(path);

    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
    path         | pageTestId
    ${"/"}       | ${"sign-up-page"}
    ${"/"}       | ${"login-page"}
    ${"/"}       | ${"users-page"}
    ${"/signup"} | ${"home-page"}
    ${"/signup"} | ${"login-page"}
    ${"/signup"} | ${"user-page"}
    ${"/login"}  | ${"home-page"}
    ${"/login"}  | ${"signup-page"}
    ${"/login"}  | ${"users-page"}
    ${"/users/1"} | ${"home-page"}
    ${"/users/1"} | ${"sign-up-page"}
    ${"/users/1"} | ${"login-page"}
  `(
    "does not display $pageTestId when path is $path",
    ({ path, pageTestId }) => {
      setup(path);

      const page = screen.queryByTestId(pageTestId);
      expect(page).not.toBeInTheDocument();
    }
  );

  it.each`
    targetPage
    ${"Home"}
    ${"Sign Up"}
    ${"Login"}
  `("has link to $targetPage on NavBar", ({ targetPage }) => {
    setup("/");
    const link = screen.getByRole("link", { name: targetPage });
    expect(link).toBeInTheDocument();
  });

  it.each`
    initialPath  | clickingTo   | visiblePage
    ${"/"}       | ${"Sign Up"} | ${"sign-up-page"}
    ${"/signup"} | ${"Home"}    | ${"home-page"}
  `(
    "displays $visiblePage after clicking $clickingTo",
    ({ initialPath, clickingTo, visiblePage }) => {
      setup(initialPath);

      const link = screen.getByRole("link", { name: clickingTo });
      userEvent.click(link);
      expect(screen.getByTestId(visiblePage)).toBeInTheDocument();
    }
  );

  it("displays home page when clicking brand logo", () => {
    setup("/login");

    const logo = screen.queryByAltText("Hoaxify");
    userEvent.click(logo);
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });
});
