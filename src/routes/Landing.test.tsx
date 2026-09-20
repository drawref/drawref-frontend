import { render, screen } from "@testing-library/react";
import Landing from "./Landing";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { BrowserRouter } from "react-router-dom";

test("renders page header", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    </Provider>,
  );
  const h1Element = screen.getByText(/select a category/i);
  expect(h1Element).toBeInTheDocument();
});
