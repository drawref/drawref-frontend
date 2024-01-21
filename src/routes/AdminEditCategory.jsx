import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import AdminCategoryInfoBox from "../components/AdminCategoryInfoBox";

import { useGetCategoryQuery } from "../app/apiSlice";

function AdminEditCategory() {
  const user = useSelector((state) => state.userProfile);
  const { categoryId } = useParams();
  const { data: categoryData, isLoading } = useGetCategoryQuery(categoryId);

  console.log(categoryId, categoryData);

  const errorToShow = "";

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App dark bg-primary-950">
        <TheHeader admin={true} />
        <div id="content" className="bg-primary-950 text-center text-white">
          <h1 className="mb-6 mt-10 text-3xl font-semibold">Edit Category</h1>
          <div className="mx-4 flex max-w-full items-end">
            {!isLoading && categoryData && (
              <AdminCategoryInfoBox
                name={categoryData.name}
                coverId={categoryData.cover_id}
                coverUrl={categoryData.cover}
                tags={categoryData.tags}
                error={errorToShow}
                onSubmit={async (data) => {
                  if (data.name !== "") {
                    console.log("Editing category:", data);
                    // try {
                    //   const result = await addCategory({ token: user.token, body: data }).unwrap();
                    //   // created successfully, move to the new category edit page
                    //   navigate(`/admin/c/${result.id}`);
                    // } catch (err) {
                    //   console.error(err);
                    // }
                  }
                }}
              />
            )}
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminEditCategory;
