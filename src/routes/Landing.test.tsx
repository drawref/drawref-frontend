import { render, screen } from "@testing-library/react";
import Landing from "./Landing";

test("renders page header", () => {
  render(<Landing />);
  const h1Element = screen.getByText(/select a category/i);
  expect(h1Element).toBeInTheDocument();
});
