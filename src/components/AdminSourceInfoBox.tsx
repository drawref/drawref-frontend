import { useState, useEffect, useRef } from "react";
import { Source } from "../types/drawref";
import { useAppSelector } from "../app/hooks";
import { useGetDirectorySuggestionsQuery } from "../app/apiSlice";

interface Props {
  source?: Source;
  onSubmit(data: Source): void;
  error?: string;
  isSubmitting?: boolean;
}

function AdminSourceInfoBox({ source, onSubmit, error, isSubmitting }: Props) {
  const user = useAppSelector((state) => state.userProfile);

  const [sName, setSName] = useState(source?.name || "");
  const [sSourceType, setSSourceType] = useState(source?.source_type || "local");
  const [sRootPath, setSRootPath] = useState(source?.root_path || "");
  const [sEnabled, setSEnabled] = useState(source?.enabled ?? true);

  const [debouncedPath, setDebouncedPath] = useState(sRootPath);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPath(sRootPath);
    }, 200);
    return () => clearTimeout(handler);
  }, [sRootPath]);

  const { data: pathSuggestions } = useGetDirectorySuggestionsQuery(
    { token: user.token, path: debouncedPath },
    { skip: sSourceType !== "local" }, // Only fetch if we're dealing with local dirs
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <form
      className="box-border flex w-[28em] max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6"
      onSubmit={(e) => {
        e.preventDefault();

        const data: Source = {
          name: sName.trim(),
          source_type: sSourceType,
          root_path: sRootPath.trim(),
          enabled: sEnabled,
        };

        if (source?.id) {
          data.id = source.id;
        }

        onSubmit(data);
      }}
    >
      <h2 className="text-xl font-medium">Source Information</h2>

      <div className="flex flex-col gap-1 text-left">
        <label htmlFor="name" className="text-lg font-medium">
          Name
        </label>
        <input
          id="name"
          className="rounded px-2 py-1.5 text-defaultText"
          value={sName}
          onChange={(e) => setSName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1 text-left">
        <label htmlFor="sourceType" className="text-lg font-medium">
          Source Type
        </label>
        <select
          id="sourceType"
          className="rounded px-2 py-1.5 text-defaultText"
          value={sSourceType}
          onChange={(e) => setSSourceType(e.target.value)}
        >
          <option value="local">Local Directory</option>
          <option value="s3">S3 Bucket</option>
        </select>
      </div>

      <div className="flex flex-col gap-1 text-left" ref={wrapperRef}>
        <label htmlFor="rootPath" className="text-lg font-medium">
          Root Path
        </label>
        <div className="relative">
          <input
            id="rootPath"
            className="w-full rounded px-2 py-1.5 text-defaultText"
            value={sRootPath}
            onChange={(e) => {
              setSRootPath(e.target.value);
              setShowAutocomplete(true);
            }}
            onFocus={() => setShowAutocomplete(true)}
            required
            autoComplete="off"
          />
          {showAutocomplete && sSourceType === "local" && pathSuggestions && pathSuggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white text-defaultText shadow-lg">
              {pathSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="cursor-pointer px-3 py-2 hover:bg-primary-100"
                  onClick={() => {
                    setSRootPath(suggestion);
                    // Keep it open to allow continuing autocomplete
                    // but we focus back to the input
                    document.getElementById("rootPath")?.focus();
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-300">
          For local directories, enter the absolute path or relative path to the server.
        </p>
      </div>

      <div className="mt-2 flex items-center gap-2 text-left">
        <input
          id="enabled"
          type="checkbox"
          className="h-5 w-5"
          checked={sEnabled}
          onChange={(e) => setSEnabled(e.target.checked)}
        />
        <label htmlFor="enabled" className="text-lg font-medium">
          Enabled (scan this source)
        </label>
      </div>

      {error && <p className="mt-4 text-center font-semibold text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 block w-full rounded bg-primary-700 py-3 text-lg font-bold text-white hover:bg-primary-600 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Source"}
      </button>
    </form>
  );
}

export default AdminSourceInfoBox;
