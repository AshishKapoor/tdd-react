import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";

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
    it("enabled the button when email and password inputs are filled", () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      userEvent.type(emailInput, "user100@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      const button = screen.queryByRole("button", { name: "Login" });
      expect(button).toBeEnabled();
    });
  });
});
