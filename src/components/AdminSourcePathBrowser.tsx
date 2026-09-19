import { useState, useMemo } from "react";
import { PathMetadata, Image, TagMap } from "../types/drawref";
import { useAppSelector } from "../app/hooks";
import { useGetSourceDirectoriesQuery, useEditImageMutation, useGetCategoriesQuery } from "../app/apiSlice";
import SessionCheckboxGroup from "./SessionCheckboxGroup";
import Icon from "@mdi/react";
import { mdiFolder, mdiArrowUp, mdiPencil, mdiImage } from "@mdi/js";

function AdminImageOverrideModal({
  image,
  categories,
  metadataList,
  onClose,
  onSave,
}: {
  image: Image;
  categories?: import("../types/drawref").Category[];
  metadataList?: PathMetadata[];
  onClose: () => void;
  onSave: (id: number, data: Partial<Image>) => Promise<void>;
}) {
  let inheritedCategoryId: string | undefined = image.effective_category_id;
  let inheritedAuthor: string | undefined = image.effective_author;
  let inheritedAuthorUrl: string | undefined = image.effective_author_url;
  let inheritedTags: TagMap | undefined = image.effective_tags;

  if (metadataList) {
    const parentMetas = metadataList.filter((m) => {
      const cleanMetaPath = m.relative_path.replace(/\/$/, "");
      return (
        cleanMetaPath === "" ||
        image.relative_path === cleanMetaPath ||
        image.relative_path.startsWith(cleanMetaPath + "/")
      );
    });
    parentMetas.sort((a, b) => b.relative_path.length - a.relative_path.length);

    if (!inheritedCategoryId) {
      const inheritedMeta = parentMetas.find((m) => m.category_id);
      if (inheritedMeta) {
        inheritedCategoryId = inheritedMeta.category_id;
      }
    }
    if (!inheritedAuthor) {
      const inheritedMeta = parentMetas.find((m) => m.author);
      if (inheritedMeta) {
        inheritedAuthor = inheritedMeta.author;
      }
    }
    if (!inheritedAuthorUrl) {
      const inheritedMeta = parentMetas.find((m) => m.author_url);
      if (inheritedMeta) {
        inheritedAuthorUrl = inheritedMeta.author_url;
      }
    }
    if (!inheritedTags || Object.keys(inheritedTags).length === 0) {
      const inheritedMeta = parentMetas.find((m) => m.tags && Object.keys(m.tags).length > 0);
      if (inheritedMeta) {
        inheritedTags = inheritedMeta.tags;
      }
    }
  }

  const hasCategoryOverride = Boolean(image.category_override);
  const [enableCategory, setEnableCategory] = useState(hasCategoryOverride);
  const [category, setCategory] = useState(image.category_override || inheritedCategoryId || categories?.[0]?.id || "");

  const hasAuthorOverride = Boolean(
    (image.author_override !== null && image.author_override !== undefined && image.author_override !== "") ||
    (image.author_url_override !== null && image.author_url_override !== undefined && image.author_url_override !== ""),
  );
  const [enableAuthor, setEnableAuthor] = useState(hasAuthorOverride);
  const [author, setAuthor] = useState(hasAuthorOverride ? (image.author_override ?? "") : (inheritedAuthor ?? ""));
  const [authorUrl, setAuthorUrl] = useState(
    hasAuthorOverride ? (image.author_url_override ?? "") : (inheritedAuthorUrl ?? ""),
  );

  const hasTagsOverride = image.tags_override != null && typeof image.tags_override === "object";
  const [enableTags, setEnableTags] = useState(hasTagsOverride);
  const [tags, setTags] = useState<TagMap>(hasTagsOverride ? image.tags_override || {} : inheritedTags || {});

  const activeCategoryId = enableCategory ? category : inheritedCategoryId;
  const selectedCategory = activeCategoryId ? categories?.find((c) => c.id === activeCategoryId) : undefined;

  const inheritedTagSummary = useMemo(() => {
    if (!inheritedTags || Object.keys(inheritedTags).length === 0) return "";
    const parts: string[] = [];
    for (const [tagGroup, values] of Object.entries(inheritedTags)) {
      if (values && values.length > 0) {
        parts.push(values.join(", "));
      }
    }
    return parts.join("; ");
  }, [inheritedTags]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="flex max-h-full max-w-4xl flex-col gap-4 overflow-y-auto rounded bg-primary-900 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-lg">{image.relative_path}</h3>
          <button onClick={onClose} className="rounded bg-primary-700 px-3 py-1 hover:bg-primary-600">
            Close
          </button>
        </div>

        <div className="flex h-64 shrink-0 items-center justify-center bg-black">
          <img
            src={`${import.meta.env.VITE_DRAWREF_IMAGE || "http://localhost:3300/image/"}${image.id}`}
            alt={image.relative_path}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="flex gap-6 rounded bg-primary-950 p-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enableCategory} onChange={(e) => setEnableCategory(e.target.checked)} />
            Override Category
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enableAuthor} onChange={(e) => setEnableAuthor(e.target.checked)} />
            Override Author
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enableTags} onChange={(e) => setEnableTags(e.target.checked)} />
            Override Tags
          </label>
        </div>

        {enableCategory && (
          <div className="flex flex-col gap-1 text-left">
            <label htmlFor="category" className="text-sm font-medium text-gray-400">
              Category
            </label>
            <select
              id="category"
              className="rounded bg-primary-950 px-2 py-1.5"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.display_name || cat.id}
                </option>
              ))}
            </select>
          </div>
        )}

        {!enableCategory && (
          <div className="text-sm text-gray-400">
            {inheritedCategoryId ? (
              <>
                Inheriting category:{" "}
                <strong>
                  {categories?.find((c) => c.id === inheritedCategoryId)?.display_name || inheritedCategoryId}
                </strong>
              </>
            ) : (
              "No category currently inherited."
            )}
          </div>
        )}

        {enableAuthor && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-sm font-medium text-gray-400">Author</label>
              <input
                type="text"
                className="rounded bg-primary-950 px-2 py-1"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-sm font-medium text-gray-400">Author URL</label>
              <input
                type="text"
                className="rounded bg-primary-950 px-2 py-1"
                value={authorUrl}
                onChange={(e) => setAuthorUrl(e.target.value)}
              />
            </div>
          </div>
        )}

        {!enableAuthor && (
          <div className="text-sm text-gray-400">
            {inheritedAuthor ? (
              <>
                Inheriting author: <strong>{inheritedAuthor}</strong>
                {inheritedAuthorUrl && (
                  <span className="ml-1">
                    (
                    <a
                      href={inheritedAuthorUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-300 underline hover:text-primary-200"
                    >
                      {inheritedAuthorUrl}
                    </a>
                    )
                  </span>
                )}
              </>
            ) : (
              "No author currently inherited."
            )}
          </div>
        )}

        {enableTags && selectedCategory && selectedCategory.tags && selectedCategory.tags.length > 0 && (
          <div className="mt-2 text-left">
            <p className="mb-2 text-sm font-medium text-gray-400">
              Tags Override ({selectedCategory.display_name || selectedCategory.id})
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded bg-primary-950 p-3">
              <SessionCheckboxGroup
                key={selectedCategory.id}
                tags={selectedCategory.tags}
                initialData={tags}
                onChange={(newTags) => setTags(newTags)}
              />
            </div>
          </div>
        )}

        {enableTags && (!selectedCategory || !selectedCategory.tags || selectedCategory.tags.length === 0) && (
          <div className="text-sm text-gray-400">No tags available for the current category.</div>
        )}

        {!enableTags && (
          <div className="text-sm text-gray-400">
            {inheritedTagSummary ? (
              <>
                Inheriting tags: <strong>{inheritedTagSummary}</strong>
              </>
            ) : (
              "No tags currently inherited."
            )}
          </div>
        )}

        <button
          onClick={async () => {
            try {
              await onSave(image.id, {
                category_override: enableCategory ? category : null,
                author_override: enableAuthor ? author : null,
                author_url_override: enableAuthor ? authorUrl : null,
                tags_override: enableTags ? tags : null,
              } as Partial<Image>);
            } catch (err) {
              console.error(err);
              alert("Failed to save image override.");
            }
          }}
          className="mt-2 rounded bg-green-700 py-2 font-medium hover:bg-green-600"
        >
          Save Overrides
        </button>
      </div>
    </div>
  );
}

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
        <AdminImageOverrideModal
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
