import { screen, render } from "../test/setup";
import Input from "./Input";

it("has is-invalid class for input when help is set", () => {
  render(<Input help="Error message" />);
  const input = screen.getByTestId("input");
  expect(input).toHaveClass("is-invalid");
});

it("has invalid-feedback class for span when help is set", () => {
  render(<Input help="Error message" />);
  const input = screen.getByTestId("span");
  expect(input).toHaveClass("invalid-feedback");
});

it("does not have is-invalid class for input when help is set", () => {
  render(<Input />);
  const input = screen.getByTestId("input");
  expect(input).not.toHaveClass("is-invalid");
});
