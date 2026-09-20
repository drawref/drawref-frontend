import { Image } from "../types/drawref";

interface Props {
  image: Image;
  isCover: boolean;
  onSetCategoryCover: () => void;
  onEditOverrides: () => void;
  onClose: () => void;
  isSettingCover?: boolean;
}

function AdminImageActionModal({
  image,
  isCover,
  onSetCategoryCover,
  onEditOverrides,
  onClose,
  isSettingCover,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 text-white">
      <div className="flex max-h-full w-full max-w-md flex-col gap-4 overflow-y-auto rounded bg-primary-900 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="truncate font-mono text-base font-medium">{image.relative_path || `Image #${image.id}`}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-primary-700 px-3 py-1 text-sm hover:bg-primary-600"
          >
            Close
          </button>
        </div>

        <div className="flex h-56 shrink-0 items-center justify-center rounded bg-black">
          <img
            src={`${import.meta.env.VITE_DRAWREF_IMAGE || "http://localhost:3300/image/"}${image.id}`}
            alt={image.relative_path || `Image #${image.id}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {isCover && (
          <div className="rounded bg-primary-950 py-1.5 text-center text-xs font-semibold uppercase tracking-wider text-green-400">
            Current Category Cover
          </div>
        )}

        <p className="text-center text-sm text-gray-300">What would you like to do with this image?</p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onSetCategoryCover}
            disabled={isSettingCover}
            className="rounded bg-primary-600 py-2.5 font-medium text-white hover:bg-primary-500 disabled:opacity-50"
          >
            {isSettingCover
              ? "Setting Cover..."
              : isCover
                ? "Set as Category Cover (Already Set)"
                : "Set as Category Cover"}
          </button>
          <button
            type="button"
            onClick={onEditOverrides}
            className="rounded bg-primary-700 py-2.5 font-medium text-white hover:bg-primary-600"
          >
            Edit Image Overrides
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-primary-800 py-2 text-sm text-gray-400 hover:bg-primary-700 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminImageActionModal;
