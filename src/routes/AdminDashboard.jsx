import { Link } from "react-router-dom";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";

import { useGetCategoriesQuery } from "../app/apiSlice";

function AdminDashboard() {
  const { data: categories, isLoading } = useGetCategoriesQuery();

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
                <Link
                  key={cat.id}
                  to={`/admin/c/${cat.id}`}
                  className="block py-2 text-xl font-medium hover:bg-primary-800"
                >
                  {cat.name}
                </Link>
              ))}
            <Link to="/admin/create-category" className="block py-3 hover:bg-primary-800">
              Create new
            </Link>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminDashboard;
