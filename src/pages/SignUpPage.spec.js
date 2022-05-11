import { render, screen } from "@testing-library/react";
import SignUpPage from "./SignUpPage";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("Includes header", () => {
      render(<SignUpPage />);
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });
    it("Has username input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });
    it("Has email input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Email");
      expect(input).toBeInTheDocument();
    });
    it("Has password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("Has password input type", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("Has password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("Has password type for password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });
    it("Has signup button", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign up" });
      expect(button).toBeInTheDocument();
    });
    it("Has signup button disabled", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign up" });
      expect(button).toBeDisabled();
    });
  });
  describe("Interactions", () => {
    let button;

    const setup = () => {
      render(<SignUpPage />);
      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Password Repeat");
      userEvent.type(usernameInput, "ashish kapoor");
      userEvent.type(emailInput, "ashish@kapoor.com");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");

      button = screen.queryByRole("button");
    };

    it("enables the button when password and repeat password field has same value", () => {
      render(<SignUpPage />);
      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Password Repeat");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");
      const button = screen.queryByRole("button");
      expect(button).toBeEnabled();
    });
    // Since we are using MSW which works with both fetch and axios
    it.skip("[axios] sends username, email and password to backend after clicking the button", () => {
      setup();

      // mock implementation
      const mockFn = jest.fn();
      axios.post = mockFn;

      userEvent.click(button);

      // axios.post("/..", body);
      const firstCallOfMockFunction = mockFn.mock.calls[0];
      const apiString = firstCallOfMockFunction[0];
      expect(apiString).toEqual("/api/1.0/users");

      const body = firstCallOfMockFunction[1];
      expect(body).toEqual({
        username: "ashish kapoor",
        email: "ashish@kapoor.com",
        password: "P4ssword",
      });
    });
    // Since we are using MSW which works with both fetch and axios
    it.skip("[fetch] sends username, email and password to backend after clicking the button", () => {
      setup();

      // mock implementation
      const mockFn = jest.fn();
      window.fetch = mockFn; // fetch

      userEvent.click(button);

      // fetch("/..", {method, headers, body});
      const firstCallOfMockFunction = mockFn.mock.calls[0];
      const apiString = firstCallOfMockFunction[0];
      expect(apiString).toEqual("/api/1.0/users");

      const body = JSON.parse(firstCallOfMockFunction[1].body);
      expect(body).toEqual({
        username: "ashish kapoor",
        email: "ashish@kapoor.com",
        password: "P4ssword",
      });
    });

    it("[MSW] sends username, email and password to backend after clicking the button", async () => {
      let reqBody;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          reqBody = req.body;
          return res(ctx.status(200));
        })
      );
      server.listen(); // msw
      setup();
      userEvent.click(button);

      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(reqBody).toEqual({
        username: "ashish kapoor",
        email: "ashish@kapoor.com",
        password: "P4ssword",
      });
    });

    it("[MSW] disables button when there's an ongoing api call", async () => {
      let counter = 0;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          counter += 1;
          return res(ctx.status(200));
        })
      );
      server.listen(); // msw
      setup();
      userEvent.click(button);
      userEvent.click(button);

      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(counter).toBe(1);
    });

    it("displays spinner after clicking the submit button", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );
      server.listen(); // msw
      setup();
      // Skipped next test because of this to make it easy to debug error.
      expect(screen.queryByRole("status", { hidden: true })).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = screen.getByRole("status", { hidden: true });
      expect(spinner).toBeInTheDocument();
    });
    // Since we could easily test it in the previous test
    it.skip("does not display spinner when there is no api request", () => {
      setup();
      const spinner = screen.queryByRole("status", { hidden: true });
      expect(spinner).not.toBeInTheDocument();
    });
  });
});
