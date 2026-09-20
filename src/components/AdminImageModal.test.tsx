import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import AdminImageModal from "./AdminImageModal";
import { Image, Category } from "../types/drawref";
import { vi } from "vitest";

const dummyImage: Image = {
  id: 42,
  source_id: 1,
  relative_path: "poses/standing_01.jpg",
  effective_author: "Artist One",
  effective_category_id: "poses",
};

const dummyCategories: Category[] = [
  {
    id: "poses",
    display_name: "Poses",
    tags: [{ id: "gender", name: "Gender", values: ["Male", "Female"] }],
  },
  {
    id: "faces",
    display_name: "Faces",
    tags: [],
  },
];

describe("AdminImageModal", () => {
  it("renders image relative path and override checkboxes", () => {
    const onClose = vi.fn();
    render(
      <Provider store={store}>
        <AdminImageModal image={dummyImage} categories={dummyCategories} onClose={onClose} />
      </Provider>,
    );

    expect(screen.getByText("poses/standing_01.jpg")).toBeInTheDocument();
    expect(screen.getByLabelText("Override Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Override Author")).toBeInTheDocument();
    expect(screen.getByLabelText("Override Tags")).toBeInTheDocument();
    expect(screen.getByText(/Inheriting author:/)).toBeInTheDocument();
    expect(screen.getByText("Artist One")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("enables overrides when checkboxes are checked and calls onSave", async () => {
    const onClose = vi.fn();
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(
      <Provider store={store}>
        <AdminImageModal image={dummyImage} categories={dummyCategories} onClose={onClose} onSave={onSave} />
      </Provider>,
    );

    // Check Override Author
    fireEvent.click(screen.getByLabelText("Override Author"));
    const authorInput = screen.getByDisplayValue("Artist One");
    fireEvent.change(authorInput, { target: { value: "New Artist" } });

    // Click Save Overrides
    fireEvent.click(screen.getByText("Save Overrides"));

    expect(onSave).toHaveBeenCalledWith(
      42,
      expect.objectContaining({
        author_override: "New Artist",
      }),
    );
  });
});
