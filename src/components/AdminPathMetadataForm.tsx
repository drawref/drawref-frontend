import { useState, useEffect, useRef } from "react";
import { PathMetadata, Category, TagMap } from "../types/drawref";
import { useAppSelector } from "../app/hooks";
import { useGetSourceDirectoriesQuery, useGetCategoriesQuery } from "../app/apiSlice";
import SessionCheckboxGroup from "./SessionCheckboxGroup";

interface Props {
  sourceId: number;
  sourceSlug: string;
  metadata?: PathMetadata;
  onSubmit(data: PathMetadata): void;
  onCancel(): void;
  isSubmitting?: boolean;
}

function AdminPathMetadataForm({ sourceId, sourceSlug, metadata, onSubmit, onCancel, isSubmitting }: Props) {
  const user = useAppSelector((state) => state.userProfile);

  const [pRelativePath, setPRelativePath] = useState(metadata?.relative_path || "");
  const [pCategoryId, setPCategoryId] = useState(metadata?.category_id || "");
  const [pAuthor, setPAuthor] = useState(metadata?.author || "");
  const [pAuthorUrl, setPAuthorUrl] = useState(metadata?.author_url || "");
  const [pTagMode, setPTagMode] = useState(metadata?.tag_mode || "merge");
  const [pTags, setPTags] = useState<TagMap>(metadata?.tags || {});

  const [debouncedPath, setDebouncedPath] = useState(pRelativePath);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: categories } = useGetCategoriesQuery();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPath(pRelativePath);
    }, 200);
    return () => clearTimeout(handler);
  }, [pRelativePath]);

  const { data: pathSuggestions } = useGetSourceDirectoriesQuery({
    token: user.token,
    slug: sourceSlug,
    path: debouncedPath,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const selectedCategory = categories?.find((c) => c.id === pCategoryId);

  return (
    <form
      className="box-border flex w-full flex-col gap-3 border-[3px] border-primary-600 bg-primary-800 p-4"
      onSubmit={(e) => {
        e.preventDefault();

        const data: PathMetadata = {
          source_id: sourceId,
          relative_path: pRelativePath.trim(),
          tags: pTags,
          tag_mode: pTagMode,
        };

        if (pCategoryId) data.category_id = pCategoryId;
        if (pAuthor.trim()) data.author = pAuthor.trim();
        if (pAuthorUrl.trim()) data.author_url = pAuthorUrl.trim();
        if (metadata?.id) data.id = metadata.id;

        onSubmit(data);
      }}
    >
      <h3 className="text-lg font-medium">{metadata ? "Edit Path Rules" : "Add Path Rules"}</h3>

      <div className="flex flex-col gap-1 text-left" ref={wrapperRef}>
        <label htmlFor="relativePath" className="font-medium">
          Relative Path (Inside Source)
        </label>
        <div className="relative">
          <input
            id="relativePath"
            className="w-full rounded px-2 py-1.5 text-defaultText"
            value={pRelativePath}
            onChange={(e) => {
              setPRelativePath(e.target.value);
              setShowAutocomplete(true);
            }}
            onFocus={() => setShowAutocomplete(true)}
            placeholder="Leave empty to apply to root"
            autoComplete="off"
            disabled={!!metadata} // Disable editing path for existing records to keep it simple
          />
          {showAutocomplete && !metadata && pathSuggestions && pathSuggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white text-defaultText shadow-lg">
              {pathSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="cursor-pointer px-3 py-2 hover:bg-primary-100"
                  onClick={() => {
                    setPRelativePath(suggestion);
                    document.getElementById("relativePath")?.focus();
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 text-left">
        <label htmlFor="category" className="font-medium">
          Category
        </label>
        <select
          id="category"
          className="rounded px-2 py-1.5 text-defaultText"
          value={pCategoryId}
          onChange={(e) => setPCategoryId(e.target.value)}
        >
          <option value="">-- None (Inherit or None) --</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.display_name || cat.id}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 text-left">
        <div className="flex flex-col gap-1">
          <label htmlFor="author" className="font-medium">
            Author Override
          </label>
          <input
            id="author"
            className="rounded px-2 py-1.5 text-defaultText"
            value={pAuthor}
            onChange={(e) => setPAuthor(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="authorUrl" className="font-medium">
            Author URL Override
          </label>
          <input
            id="authorUrl"
            className="rounded px-2 py-1.5 text-defaultText"
            value={pAuthorUrl}
            onChange={(e) => setPAuthorUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 text-left">
        <label htmlFor="tagMode" className="font-medium">
          Tag Merge Mode
        </label>
        <select
          id="tagMode"
          className="rounded px-2 py-1.5 text-defaultText"
          value={pTagMode}
          onChange={(e) => setPTagMode(e.target.value)}
        >
          <option value="merge">Merge with parent folders</option>
          <option value="replace">Replace parent folders</option>
        </select>
      </div>

      {selectedCategory && selectedCategory.tags && selectedCategory.tags.length > 0 && (
        <div className="mt-2 text-left">
          <p className="mb-2 font-medium">Tags ({selectedCategory.display_name || selectedCategory.id})</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded bg-primary-900 p-3">
            <SessionCheckboxGroup tags={selectedCategory.tags} onChange={(tags) => setPTags(tags)} />
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-primary-600 px-4 py-2 font-medium hover:bg-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-green-700 px-4 py-2 font-medium hover:bg-green-600 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Path Metadata"}
        </button>
      </div>
    </form>
  );
}

export default AdminPathMetadataForm;
