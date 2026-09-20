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
} from "../app/apiSlice";
import type { Category } from "../types/drawref";

function AdminDashboard() {
  const [loadSamples, { isLoading: isSamplesLoading }] = useLoadSamplesMutation();
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [reorderCategories] = useReorderCategoriesMutation();

  const user = useAppSelector((state) => state.userProfile);
  const [localCategories, setLocalCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (categories) {
      setLocalCategories(categories);
    }
  }, [categories]);

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
        token: user.token,
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
                            token: user.token,
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
                  await loadSamples({ token: user.token });
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
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminDashboard;
