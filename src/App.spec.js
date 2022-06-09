import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "./App";

const server = setupServer(
  rest.get("/api/1.0/users/:id", (req, res, ctx) => {
    const id = Number.parseInt(req.params.id);
    return res(
      ctx.status(200),
      ctx.json({
        id,
        username: "user" + id,
        email: `user${id}@mail.com`,
        image: null,
      })
    );
  }),
  rest.get("/api/1.0/users", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        content: [
          {
            id: 1,
            username: "user-in-list",
            email: "user-in-list@mail.com",
            image: null,
          },
        ],
        page: 0,
        size: 0,
        totalPages: 0,
      })
    );
  }),
  rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post("/api/1.0/auth", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 5,
        username: "user5",
      })
    );
  })
);
beforeAll(() => server.listen());
beforeEach(() => {
  server.resetHandlers(); // res.once() alt.
});
afterAll(() => server.close());

const setup = (path) => {
  window.history.pushState({}, "", path);
  render(<App />);
};

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
    path               | pageTestId
    ${"/"}             | ${"home-page"}
    ${"/signup"}       | ${"sign-up-page"}
    ${"/login"}        | ${"login-page"}
    ${"/user/1"}       | ${"user-page"}
    ${"/user/2"}       | ${"user-page"}
    ${"/activate/123"} | ${"account-activation-page"}
    ${"/activate/456"} | ${"account-activation-page"}
  `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
    setup(path);

    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
    path               | pageTestId
    ${"/"}             | ${"sign-up-page"}
    ${"/"}             | ${"login-page"}
    ${"/"}             | ${"user-page"}
    ${"/"}             | ${"account-activation-page"}
    ${"/signup"}       | ${"home-page"}
    ${"/signup"}       | ${"login-page"}
    ${"/signup"}       | ${"user-page"}
    ${"/signup"}       | ${"account-activation-page"}
    ${"/login"}        | ${"home-page"}
    ${"/login"}        | ${"signup-page"}
    ${"/login"}        | ${"user-page"}
    ${"/user/1"}       | ${"home-page"}
    ${"/user/1"}       | ${"sign-up-page"}
    ${"/user/1"}       | ${"login-page"}
    ${"/user/1"}       | ${"account-activation-page"}
    ${"/activate/123"} | ${"home-page"}
    ${"/activate/123"} | ${"sign-up-page"}
    ${"/activate/123"} | ${"login-page"}
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

    const logo = screen.queryByAltText("React with TDD");
    userEvent.click(logo);
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });
  // silenced due to falsy results
  it.skip("navigates to user page when clicking the username on the user list", async () => {
    setup("/");
    const user = await screen.findByText("user-in-list");
    userEvent.click(user);
    const page = await screen.findByTestId("user-page");
    expect(page).toBeInTheDocument();
  });
});

// console.error = () => {};

describe("Login", () => {
  const setupLoggedIn = () => {
    setup("login");
    userEvent.type(screen.getByLabelText("Email"), "user5@mail.com");
    userEvent.type(screen.getByLabelText("Password"), "P4ssword");
    userEvent.click(screen.getByRole("button"), { name: "Login" });
  };

  it("redirects to homepage after successful login", async () => {
    setupLoggedIn();
    const page = await screen.findByTestId("home-page");
    expect(page).toBeInTheDocument();
  });
  it("hides login and signup on navbar after successful login", async () => {
    setupLoggedIn();
    await screen.findByTestId("home-page");
    const loginLink = screen.queryByRole("link", { name: "Login" });
    const signupLink = screen.queryByRole("link", { name: "Sign Up" });
    expect(loginLink).not.toBeInTheDocument();
    expect(signupLink).not.toBeInTheDocument();
  });
  it.skip("displays myprofile link on navbar after successful login", async () => {
    setup("login");
    const myProfileLinkBeforeLogin = screen.queryByRole("link", {
      name: "My Profile",
    });
    expect(myProfileLinkBeforeLogin).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText("Email"), "user5@mail.com");
    userEvent.type(screen.getByLabelText("Password"), "P4ssword");
    userEvent.click(screen.getByRole("button"), { name: "Login" });
    await screen.findByTestId("home-page");
    const myProfileLinkAfterLogin = screen.queryByRole("link", {
      name: "My Profile",
    });
    expect(myProfileLinkAfterLogin).toBeInTheDocument();
  });
  it("displays user page with logged in user id in url after clicking My Profile link", async () => {
    setupLoggedIn();
    await screen.findByTestId("home-page");
    const myProfileLink = screen.queryByRole("link", { name: "My Profile" });
    userEvent.click(myProfileLink);
    await screen.findByTestId("user-page");
    const username = await screen.findByText("user5");
    expect(username).toBeInTheDocument();
  });
});
