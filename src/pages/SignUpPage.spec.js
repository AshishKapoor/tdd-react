import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { rest } from "msw";
import { setupServer } from "msw/node";
import LanguageSelector from "../components/LanguageSelector";
import en from "../locale/en.json";
import hi from "../locale/hi.json";
import "../locale/i18n";
import SignUpPage from "./SignUpPage";

let reqBody;
let counter = 0;
let acceptLanguageHeader;
const server = setupServer(
  rest.post("/api/1.0/users", (req, res, ctx) => {
    counter += 1;
    acceptLanguageHeader = req.headers.get("Accept-Language")
    reqBody = req.body;
    return res(ctx.status(200));
  })
);
beforeAll(() => server.listen());
beforeEach(() => {
  counter = 0;
  server.resetHandlers(); // res.once() alt.
});
afterAll(() => server.close());

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
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });
    it("Has signup button disabled", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });
  describe("Interactions", () => {
    let button, usernameInput, emailInput, passwordInput, passwordRepeatInput;
    const message = "Please check your e-mail to activate your account";
    const setup = () => {
      render(<SignUpPage />);
      usernameInput = screen.getByLabelText("Username");
      emailInput = screen.getByLabelText("Email");
      passwordInput = screen.getByLabelText("Password");
      passwordRepeatInput = screen.getByLabelText("Password Repeat");
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
      setup();
      userEvent.click(button);

      // await new Promise((resolve) => setTimeout(resolve, 500)); // Hacky way
      await screen.findByText(message);
      expect(reqBody).toEqual({
        username: "ashish kapoor",
        email: "ashish@kapoor.com",
        password: "P4ssword",
      });
    });

    it("[MSW] disables button when there's an ongoing api call", async () => {
      setup();
      userEvent.click(button);
      userEvent.click(button);

      await screen.findByText(message);

      expect(counter).toBe(1);
    });

    it("displays spinner after clicking the submit button", async () => {
      setup();
      // Skipped next test because of this to make it easy to debug error.
      expect(
        screen.queryByRole("status", { hidden: true })
      ).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = screen.getByRole("status", { hidden: true });
      expect(spinner).toBeInTheDocument();
      await screen.findByText(message);
    });
    // Since we could easily test it in the previous test
    it.skip("does not display spinner when there is no api request", () => {
      setup();
      const spinner = screen.queryByRole("status", { hidden: true });
      expect(spinner).not.toBeInTheDocument();
    });

    it("displays account activation notification after success with sign up request", async () => {
      setup();

      expect(screen.queryByText(message)).not.toBeInTheDocument();
      userEvent.click(button);

      const text = await screen.findByText(message);
      expect(text).toBeInTheDocument();
    });
    it("hides sign up form after successful signup request", async () => {
      setup();
      const form = screen.getByTestId("form-sign-up");
      userEvent.click(button);
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
      // await waitForElementToBeRemoved(form);
    });

    // Validations
    // it("displays validation message for username", async () => {
    //   server.use(
    //     rest.post("/api/1.0/users", (req, res, ctx) => {
    //       return res(
    //         ctx.status(400),
    //         ctx.json({
    //           validationErrors: {
    //             username: "Username cannot be null"
    //           }
    //         })
    //       );
    //     })
    //   );
    //   setup();
    //   userEvent.click(button);
    //   const validationError = await screen.findByText('Username cannot be null')
    //   expect(validationError).toBeInTheDocument();
    // });

    // it("displays validation message for email", async () => {
    //   server.use(
    //     rest.post("/api/1.0/users", (req, res, ctx) => {
    //       return res(
    //         ctx.status(400),
    //         ctx.json({
    //           validationErrors: {
    //             email: "Email cannot be null"
    //           }
    //         })
    //       );
    //     })
    //   );
    //   setup();
    //   userEvent.click(button);
    //   const validationError = await screen.findByText('Email cannot be null')
    //   expect(validationError).toBeInTheDocument();
    // });

    // To avoid writing repetitive tests
    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"Email cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `("displays $message for $field", async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(message);
      expect(validationError).toBeInTheDocument();
    });

    it("hides spinner and enables button after response received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      setup();
      userEvent.click(button);
      await screen.findByText("Username cannot be null");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it("displays mismatch message for password repeat input", () => {
      setup();
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "MismatchP4ssword");
      const validationError = screen.queryByText("Password mismatch");
      expect(validationError).toBeInTheDocument();
    });

    it("clears validation error after username field is updated", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(
        "Username cannot be null"
      );
      userEvent.type(usernameInput, "user1-updated");
      expect(validationError).not.toBeInTheDocument();
    });
  });
  describe("Internationalization", () => {
    let hindiToggle, englishToggle, passwordInput, passwordRepeatInput;
    const setup = () => {
      render(
        <>
          <SignUpPage />
          <LanguageSelector />
        </>
      );
      hindiToggle = screen.getByTitle("Hindi");
      englishToggle = screen.getByTitle("English");
      passwordInput = screen.getByLabelText(en.password);
      passwordRepeatInput = screen.getByLabelText(en.repeatPassword);
    };

    it("initially displays all texts in english", () => {
      setup();
      expect(
        screen.getByRole("heading", {
          name: en.signUp,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: en.signUp,
        })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.userName)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.repeatPassword)).toBeInTheDocument();
    });

    it("displays all text in Hindi after changing the language", () => {
      setup();
      userEvent.click(hindiToggle);
      expect(
        screen.getByRole("heading", {
          name: hi.signUp,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: hi.signUp,
        })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(hi.userName)).toBeInTheDocument();
      expect(screen.getByLabelText(hi.email)).toBeInTheDocument();
      expect(screen.getByLabelText(hi.password)).toBeInTheDocument();
      expect(screen.getByLabelText(hi.repeatPassword)).toBeInTheDocument();
    });

    it("displays all text in English after changing the language back from Hindi", () => {
      setup();
      userEvent.click(hindiToggle);
      userEvent.click(englishToggle);
      expect(
        screen.getByRole("heading", {
          name: en.signUp,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: en.signUp,
        })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.userName)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.repeatPassword)).toBeInTheDocument();
    });

    it("displays password mismatch validation in hindi", () => {
      setup();

      userEvent.click(hindiToggle);

      userEvent.type(passwordInput, "P4ss");

      const validationMessageInHindi = screen.queryByText(
        hi.passwordMismatchValidation
      );
      expect(validationMessageInHindi).toBeInTheDocument();
    });

    it("sends accept language header as en for outgoing request", async () => {
      setup();

      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");

      const button = screen.getByRole("button", { name: en.signUp });
      const form = screen.queryByTestId('form-sign-up');

      userEvent.click(button);
      await waitForElementToBeRemoved(form);
      expect(acceptLanguageHeader).toBe("en");
    });


    it("sends accept language header as hi for outgoing request after selecting that languge", async () => {
      setup();

      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");

      const button = screen.getByRole("button", { name: en.signUp });
      userEvent.click(hindiToggle);
      const form = screen.queryByTestId('form-sign-up');

      userEvent.click(button);
      await waitForElementToBeRemoved(form);
      expect(acceptLanguageHeader).toBe("hi");
    });
  });
});
