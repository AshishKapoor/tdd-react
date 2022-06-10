import {
  render,
  screen,
  waitForElementToBeRemoved
} from "../test/setup";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import LanguageSelector from "../components/LanguageSelector";
import en from "../locale/en.json";
import hi from "../locale/hi.json";
import "../locale/i18n";
import LoginPage from "./LoginPage";

let requestBody,
  acceptLanguageHeader,
  count = 0;

const server = setupServer(
  rest.post("/api/1.0/auth", (req, res, ctx) => {
    requestBody = req.body;
    count += 1;
    acceptLanguageHeader = req.headers.get("Accept-Language");
    return res(
      ctx.status(401),
      ctx.json({
        message: "Incorrect credentials",
      })
    );
  })
);
beforeAll(() => server.listen());
beforeEach(() => {
  count = 0;
  server.resetHandlers(); // res.once() alt.
});
afterAll(() => server.close());

describe("Login Page", () => {
  describe("Layout", () => {
    it("Includes header", () => {
      render(<LoginPage />);
      const header = screen.queryByRole("heading", { name: "Login" });
      expect(header).toBeInTheDocument();
    });
    it("Has email input", () => {
      render(<LoginPage />);
      const input = screen.getByLabelText("Email");
      expect(input).toBeInTheDocument();
    });
    it("Has password input", () => {
      render(<LoginPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("Has password type for password input", () => {
      render(<LoginPage />);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("Has login button", () => {
      render(<LoginPage />);
      const button = screen.queryByRole("button", { name: "Login" });
      expect(button).toBeInTheDocument();
    });
    it("disables the button initially", () => {
      render(<LoginPage />);
      const button = screen.queryByRole("button", { name: "Login" });
      expect(button).toBeDisabled();
    });
  });
  describe("Interactions", () => {
    let button, emailInput, passwordInput;
    const setup = () => {
      render(<LoginPage />);
      emailInput = screen.getByLabelText("Email");
      passwordInput = screen.getByLabelText("Password");
      userEvent.type(emailInput, "user100@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      button = screen.queryByRole("button", { name: "Login" });
    };
    it("enabled the button when email and password inputs are filled", () => {
      setup();
      expect(button).toBeEnabled();
    });
    it("displays spinner during api call", async () => {
      setup();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitForElementToBeRemoved(spinner);
    });
    it("sends email and password to backend after clicking the button", async () => {
      setup();
      userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitForElementToBeRemoved(spinner);
      expect(requestBody).toEqual({
        email: "user100@mail.com",
        password: "P4ssword",
      });
    });
    it("disables the button when there is an api call", async () => {
      setup();
      userEvent.click(button);
      userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitForElementToBeRemoved(spinner);
      expect(count).toEqual(1);
    });
    it("disables authentication failed message", async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      expect(errorMessage).toBeInTheDocument();
    });
    it("clears authentication fail message when email field is changed", async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      userEvent.type(emailInput, "new@mail.com");
      expect(errorMessage).not.toBeInTheDocument();
    });
    it("clears authentication fail message when password field is changed", async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      userEvent.type(passwordInput, "P4ssword");
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
  describe("Internationalization", () => {
    let hindiToggle;
    const setup = () => {
      render(
        <>
          <LoginPage />
          <LanguageSelector />
        </>
      );
      hindiToggle = screen.getByTitle("Hindi");
    };

    it("initially displays all texts in english", () => {
      setup();
      expect(
        screen.getByRole("heading", {
          name: en.login,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: en.login,
        })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
    });
    it("displays all text in Hindi after changing the language", () => {
      setup();
      userEvent.click(hindiToggle);
      expect(
        screen.getByRole("heading", {
          name: hi.login,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: hi.login,
        })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(hi.email)).toBeInTheDocument();
      expect(screen.getByLabelText(hi.password)).toBeInTheDocument();
    });
    it("sets accept language header to en for outgoing request", async () => {
      setup();
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      userEvent.type(emailInput, "user100@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      const button = screen.queryByRole("button", { name: "Login" });
      userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitForElementToBeRemoved(spinner);
      expect(acceptLanguageHeader).toBe("en");
    });
    it("sets accept language header to hi for outgoing request", async () => {
      setup();
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      userEvent.type(emailInput, "user100@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      const button = screen.queryByRole("button", { name: "Login" });
      userEvent.click(hindiToggle);
      userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitForElementToBeRemoved(spinner);
      expect(acceptLanguageHeader).toBe("hi");
    });
  });
});
