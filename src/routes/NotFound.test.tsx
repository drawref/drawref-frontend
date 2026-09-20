import { render, screen } from "@testing-library/react";
import NotFound from "./NotFound";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { BrowserRouter } from "react-router-dom";

test("renders page content", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    </Provider>,
  );
  const h1Element = screen.getByText(/404 not found/i);
  expect(h1Element).toBeInTheDocument();
});
