import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiTrashCan, mdiArrowUp, mdiArrowDown } from "@mdi/js";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";

import { useAppSelector } from "../app/hooks";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useReorderCategoriesMutation,
  useLoadSamplesMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../app/apiSlice";
import type { Category } from "../types/drawref";

function AdminDashboard() {
  const currentUser = useAppSelector((state) => state.userProfile);
  const [loadSamples, { isLoading: isSamplesLoading }] = useLoadSamplesMutation();
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [reorderCategories] = useReorderCategoriesMutation();
  const { data: settings } = useGetSettingsQuery({ token: currentUser.token }, { skip: !currentUser.token });
  const [updateSettings, { isLoading: isUpdatingSettings }] = useUpdateSettingsMutation();

  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [thumbnailLimit, setThumbnailLimit] = useState<string>("400");
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (categories) {
      setLocalCategories(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (settings) {
      setThumbnailLimit(String(settings.thumbnail_min_filesize_kb ?? 400));
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    const kb = parseInt(thumbnailLimit, 10);
    if (isNaN(kb) || kb < 0) {
      alert("Please enter a valid non-negative number for thumbnail threshold (KB).");
      return;
    }

    try {
      await updateSettings({
        token: currentUser.token,
        body: {
          thumbnail_min_filesize_kb: kb,
        },
      }).unwrap();
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save settings", err);
      alert("Failed to save settings.");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localCategories.length) return;

    const newCategories = [...localCategories];
    const item = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = item;

    setLocalCategories(newCategories);

    try {
      await reorderCategories({
        token: currentUser.token,
        body: {
          ids: newCategories.map((c) => c.id),
        },
      }).unwrap();
    } catch (err) {
      console.error("Failed to reorder categories", err);
      if (categories) {
        setLocalCategories(categories);
      }
    }
  };

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App dark bg-primary-950">
        <TheHeader admin={true} />
        <div id="content" className="mb-8 bg-primary-950 text-center text-white">
          <h1 className="mb-3 mt-10 text-2xl font-semibold">Categories</h1>
          <div className="mx-auto flex w-[22em] max-w-full flex-col border-[5px] border-primary-700 bg-primary-900">
            {localCategories &&
              localCategories.map((cat, index) => (
                <div key={cat.id} className="flex flex-nowrap items-center">
                  <Link
                    to={`/admin/c/${cat.id}`}
                    className="block flex-grow py-2 text-xl font-medium hover:bg-primary-800"
                  >
                    {cat.display_name || cat.id}
                  </Link>
                  <div className="flex flex-nowrap">
                    <button
                      type="button"
                      className="block px-2 py-2 hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent"
                      title="Move category up"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                    >
                      <Icon path={mdiArrowUp} size={0.9} className="text-white" />
                    </button>
                    <button
                      type="button"
                      className="block px-2 py-2 hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent"
                      title="Move category down"
                      disabled={index === localCategories.length - 1}
                      onClick={() => handleMove(index, "down")}
                    >
                      <Icon path={mdiArrowDown} size={0.9} className="text-white" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="block px-3 py-2 text-xl font-medium hover:bg-red-800"
                    title="Delete category"
                    onClick={async (e) => {
                      if (
                        window.confirm(
                          `Delete ${cat.display_name || cat.id} category?\nThis will also remove all images from this category.`,
                        )
                      ) {
                        try {
                          await deleteCategory({
                            id: cat.id,
                            token: currentUser.token,
                          });
                        } catch (err) {
                          console.error(err);
                          return;
                        }
                      }
                    }}
                  >
                    <Icon path={mdiTrashCan} title="Delete category" size={1.2} className="text-white" />
                  </button>
                </div>
              ))}
            <Link to="/admin/create-category" className="block py-3 hover:bg-primary-800">
              Create new
            </Link>
            {(!localCategories || localCategories.length === 0) && (
              <button
                className="block w-full cursor-pointer px-3 py-3 text-left hover:bg-primary-800"
                disabled={isSamplesLoading}
                onClick={async () => {
                  await loadSamples({ token: currentUser.token });
                  alert("Sample data added! Images are scanning in the background.");
                }}
              >
                Add sample data
              </button>
            )}
          </div>

          <h1 className="mb-3 mt-10 text-2xl font-semibold">Sources</h1>
          <div className="mx-auto flex w-[22em] max-w-full flex-col border-[5px] border-primary-700 bg-primary-900">
            <Link to="/admin/sources" className="block py-3 hover:bg-primary-800">
              Manage Sources
            </Link>
          </div>

          <h1 className="mb-3 mt-10 text-2xl font-semibold">Settings</h1>
          <div className="mx-auto flex w-[22em] max-w-full flex-col border-[5px] border-primary-700 bg-primary-900 p-4 text-left">
            <h2 className="mb-2 text-lg font-medium text-white">Thumbnail Settings</h2>
            <div className="mb-4">
              <label htmlFor="thumbnail-limit" className="block text-sm font-medium text-gray-200">
                Size Threshold (KB)
              </label>
              <p className="mb-2 text-xs text-gray-400">
                Images over this file size will be resized to requested thumbnail dimensions. Smaller images are served
                directly in their original size.
              </p>
              <input
                id="thumbnail-limit"
                type="number"
                min="0"
                value={thumbnailLimit}
                onChange={(e) => setThumbnailLimit(e.target.value)}
                className="w-full rounded border border-primary-600 bg-primary-950 px-3 py-1.5 text-white"
                placeholder="400"
              />
            </div>

            <div className="mb-4 rounded bg-primary-950/60 p-3 text-xs text-gray-300">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold text-gray-200">Thumbnail Caching:</span>
                <span
                  className={settings?.cache_enabled ? "font-semibold text-green-400" : "font-semibold text-amber-400"}
                >
                  {settings?.cache_enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              {settings?.cache_enabled ? (
                <>
                  <p className="truncate text-gray-400">
                    Path: <span className="font-mono text-gray-200">{settings.cache_path}</span>
                  </p>
                  <p className="mt-1 text-gray-400">Cached sizes: {settings.allowed_cache_sizes?.join(", ")} px</p>
                </>
              ) : (
                <p className="mt-1 text-gray-400">
                  Set <span className="font-mono text-xs text-gray-200">CACHE_PATH</span> on backend to enable disk
                  caching.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={isUpdatingSettings}
              onClick={handleSaveSettings}
              className="cursor-pointer rounded bg-primary-600 py-2 font-medium text-white hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdatingSettings ? "Saving..." : "Save Settings"}
            </button>
            {settingsSaved && <p className="mt-2 text-center text-xs text-green-400">Settings saved successfully!</p>}
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminDashboard;
