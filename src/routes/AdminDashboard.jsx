import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiTrashCan } from "@mdi/js";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";

import { useGetCategoriesQuery, useDeleteCategoryMutation } from "../app/apiSlice";

function AdminDashboard() {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const user = useSelector((state) => state.userProfile);

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App dark bg-primary-950">
        <TheHeader admin={true} />
        <div id="content" className="mb-8 bg-primary-950 text-center text-white">
          <h1 className="mb-3 mt-10 text-2xl font-semibold">Categories</h1>
          <div className="mx-auto flex w-[20em] max-w-full flex-col border-[5px] border-primary-700 bg-primary-900">
            {categories &&
              categories.map((cat) => (
                <div key={cat.id} className="flex flex-nowrap">
                  <Link
                    to={`/admin/c/${cat.id}`}
                    className="block flex-grow py-2 text-xl font-medium hover:bg-primary-800"
                  >
                    {cat.name}
                  </Link>
                  <button
                    className="block px-3 py-2 text-xl font-medium hover:bg-red-800"
                    onClick={async (e) => {
                      if (
                        window.confirm(
                          `Delete ${cat.name} category?\nThis will also remove all images from this category.`,
                        )
                      ) {
                        try {
                          await deleteCategory({
                            category: cat.id,
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
            {(!categories || categories.length === 0) && (
              <Link to="/admin/add-sample-data" className="block py-3 hover:bg-primary-800">
                Add sample data
              </Link>
            )}
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminDashboard;
