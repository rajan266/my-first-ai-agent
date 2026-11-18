import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";

test("shows Welcome back after clicking Login", async () => {
  // 1. Arrange
  render(<Login />);

  // 2. Act
  await userEvent.click(screen.getByRole("button", { name: "Login" }));

  // 3. Assert
  expect(screen.getByText("Welcome back")).toBeInTheDocument();
});