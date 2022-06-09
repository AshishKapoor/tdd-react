import { render, screen, waitFor } from "@testing-library/react";
import UsersPage from "./UsersPage";
import { setupServer } from "msw/node";
import { rest } from "msw";

const server = setupServer();
beforeAll(() => server.listen());
beforeEach(() => {
  server.resetHandlers(); // res.once() alt.
});
afterAll(() => server.close());

describe("User Page", () => {
  beforeEach(() => {
    server.use(
      rest.get("/api/1.0/users/:id", (req, res, ctx) => {
        const id = Number.parseInt(req.params.id);
        if (req.params.id === "1") {
          return res(
            ctx.json({
              id,
              username: "user" + id,
              email: `user${id}@mail.com`,
              image: null,
            }),
            ctx.status(200)
          );
        }
        return res(
          ctx.json({
            message: "User not found",
          }),
          ctx.status(400)
        );
      })
    );
  });
  it("displays user name on page when user is found", async () => {
    const match = { params: { id: 1 } };
    render(<UsersPage match={match} />);
    await waitFor(async () => {
      expect(screen.getByText("user1")).toBeInTheDocument();
    });
  });
  it("displays spinner while the api call is in progress", async () => {
    const match = { params: { id: 1 } };
    render(<UsersPage match={match} />);
    const spinner = screen.getByRole("status");
    await screen.findByText("user1");
    expect(spinner).not.toBeInTheDocument();
  });
  it("displays error message received from backend when the user is not found", async () => {
    const match = { params: { id: 100 } };
    render(<UsersPage match={match} />);
    await waitFor(() => {
      expect(screen.queryByText("User not found")).toBeInTheDocument();
    });
  });
});
