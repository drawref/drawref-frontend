import { render, screen, fireEvent } from "@testing-library/react";
import AdminImageActionModal from "./AdminImageActionModal";
import { Image } from "../types/drawref";
import { vi } from "vitest";

const dummyImage: Image = {
  id: 42,
  source_id: 1,
  relative_path: "poses/standing_01.jpg",
};

describe("AdminImageActionModal", () => {
  it("renders image path and action options", () => {
    const onSetCover = vi.fn();
    const onEditOverrides = vi.fn();
    const onClose = vi.fn();

    render(
      <AdminImageActionModal
        image={dummyImage}
        isCover={false}
        onSetCategoryCover={onSetCover}
        onEditOverrides={onEditOverrides}
        onClose={onClose}
      />,
    );

    expect(screen.getByText("poses/standing_01.jpg")).toBeInTheDocument();
    expect(screen.getByText("Set as Category Cover")).toBeInTheDocument();
    expect(screen.getByText("Edit Image Overrides")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Set as Category Cover"));
    expect(onSetCover).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Edit Image Overrides"));
    expect(onEditOverrides).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("indicates when image is currently the cover", () => {
    render(
      <AdminImageActionModal
        image={dummyImage}
        isCover={true}
        onSetCategoryCover={vi.fn()}
        onEditOverrides={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Current Category Cover")).toBeInTheDocument();
    expect(screen.getByText("Set as Category Cover (Already Set)")).toBeInTheDocument();
  });
});
