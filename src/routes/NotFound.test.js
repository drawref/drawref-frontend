import { render, screen } from "@testing-library/react";
import NotFound from "./NotFound";

test("renders page content", () => {
  render(<NotFound />);
  const h1Element = screen.getByText(/404 not found/i);
  expect(h1Element).toBeInTheDocument();
});
