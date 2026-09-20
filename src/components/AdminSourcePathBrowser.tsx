import { useState, useMemo } from "react";
import { PathMetadata, Image } from "../types/drawref";
import { useAppSelector } from "../app/hooks";
import { useGetSourceDirectoriesQuery, useEditImageMutation, useGetCategoriesQuery } from "../app/apiSlice";
import AdminImageModal from "./AdminImageModal";
import Icon from "@mdi/react";
import { mdiFolder, mdiArrowUp, mdiPencil, mdiImage } from "@mdi/js";

interface Props {
  sourceId: number;
  sourceSlug: string;
  metadataList?: PathMetadata[];
  onEditMetadata: (meta: PathMetadata | { relative_path: string }) => void;
}

function AdminSourcePathBrowser({ sourceId, sourceSlug, metadataList, onEditMetadata }: Props) {
  const user = useAppSelector((state) => state.userProfile);
  const [currentPath, setCurrentPath] = useState("");
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const { data: browserData, isLoading: isFetching } = useGetSourceDirectoriesQuery({
    token: user.token,
    slug: sourceSlug,
    path: currentPath,
  });

  const { data: categories } = useGetCategoriesQuery();

  const [editImage] = useEditImageMutation();

  const handleNavigateUp = () => {
    if (!currentPath) return;
    const parts = currentPath.replace(/\/$/, "").split("/");
    parts.pop();
    const newPath = parts.length > 0 ? parts.join("/") + "/" : "";
    setCurrentPath(newPath);
  };

  const handleNavigateDown = (dir: string) => {
    setCurrentPath(dir);
  };

  const currentMetadata = useMemo(() => {
    const p = currentPath.replace(/\/$/, "");
    return metadataList?.find((m) => m.relative_path === p) || { relative_path: p };
  }, [metadataList, currentPath]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded bg-primary-800 p-3">
        <div>
          <p className="font-mono text-sm font-medium">/{currentPath}</p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-300">
            {"id" in currentMetadata ? (
              <>
                {currentMetadata.category_id && <span>Category: {currentMetadata.category_id}</span>}
                {currentMetadata.author && <span>Author: {currentMetadata.author}</span>}
                <span>Mode: {currentMetadata.tag_mode}</span>
                {Object.keys(currentMetadata.tags || {}).length > 0 && <span>Tags: defined</span>}
              </>
            ) : (
              <span className="italic text-gray-400">No specific metadata rule for this folder</span>
            )}
          </div>
        </div>
        <button
          onClick={() => onEditMetadata(currentMetadata)}
          className="rounded bg-primary-600 px-3 py-1.5 text-sm hover:bg-primary-500"
        >
          <Icon path={mdiPencil} size={0.7} className="mr-1 inline" />
          {"id" in currentMetadata ? "Edit Rule" : "Add Rule"}
        </button>
      </div>

      <div className="flex flex-col overflow-hidden rounded border border-primary-700 bg-primary-800">
        {currentPath !== "" && (
          <button
            onClick={handleNavigateUp}
            className="flex items-center gap-2 border-b border-primary-700 p-2 hover:bg-primary-700"
          >
            <Icon path={mdiArrowUp} size={0.8} />
            <span>..</span>
          </button>
        )}

        {isFetching && <div className="p-4 text-center text-gray-400">Loading...</div>}

        {!isFetching &&
          browserData?.directories?.map((dir) => {
            const displayDir = currentPath && dir.startsWith(currentPath) ? dir.slice(currentPath.length) : dir;
            return (
              <button
                key={dir}
                onClick={() => handleNavigateDown(dir)}
                className="flex items-center gap-2 border-b border-primary-700 p-2 text-left hover:bg-primary-700"
              >
                <Icon path={mdiFolder} size={0.8} className="text-yellow-400" />
                <span className="font-mono text-sm">{displayDir}</span>
              </button>
            );
          })}

        {!isFetching &&
          browserData?.images?.map((img) => {
            const displayImg =
              currentPath && img.relative_path.startsWith(currentPath)
                ? img.relative_path.slice(currentPath.length)
                : img.relative_path;
            return (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className="flex items-center gap-2 border-b border-primary-700 p-2 text-left hover:bg-primary-700"
              >
                <Icon path={mdiImage} size={0.8} className="text-blue-400" />
                <span className="font-mono text-sm">{displayImg}</span>
                {(Boolean(img.category_override) ||
                  Boolean(img.author_override) ||
                  Boolean(img.author_url_override) ||
                  (img.tags_override != null && typeof img.tags_override === "object")) && (
                  <span className="ml-auto rounded bg-purple-700 px-2 py-0.5 text-xs text-white">Override</span>
                )}
              </button>
            );
          })}

        {!isFetching && browserData?.directories?.length === 0 && browserData?.images?.length === 0 && (
          <div className="p-4 text-center text-gray-400">Empty folder</div>
        )}
      </div>

      {selectedImage && (
        <AdminImageModal
          key={selectedImage.id}
          image={selectedImage}
          categories={categories}
          metadataList={metadataList}
          onClose={() => setSelectedImage(null)}
          onSave={async (id, data) => {
            await editImage({
              token: user.token,
              id,
              body: data,
            }).unwrap();
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminSourcePathBrowser;
