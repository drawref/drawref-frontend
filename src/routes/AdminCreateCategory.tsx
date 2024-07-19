import { useNavigate } from "react-router-dom";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import AdminCategoryInfoBox from "../components/AdminCategoryInfoBox";

import { useAppSelector } from "../app/hooks";
import { useAddCategoryMutation } from "../app/apiSlice";

function AdminCreateCategory() {
  const user = useAppSelector((state) => state.userProfile);

  const [addCategory, { isLoading: isAddingCategory, error: categoryError }] = useAddCategoryMutation();
  const navigate = useNavigate();

  const errorToShow = categoryError ? categoryError.data.error : "";

  return (
    <>
      {isAddingCategory && <TheLoadingModal />}
      <div className="App dark bg-primary-950">
        <TheHeader admin={true} />
        <div id="content" className="bg-primary-950 text-center text-white">
          <h1 className="mb-6 mt-10 text-3xl font-semibold">Create Category</h1>
          <div className="mx-4 mb-8 flex max-w-full items-start justify-center gap-6">
            <AdminCategoryInfoBox
              error={errorToShow}
              onSubmit={async (data) => {
                if (data.id !== "" && data.name !== "") {
                  try {
                    const result = await addCategory({ token: user.token, body: data }).unwrap();
                    // created successfully, move to the new category edit page
                    navigate(`/admin/c/${result.id}`);
                  } catch (err) {
                    console.error(err);
                  }
                }
              }}
            />
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminCreateCategory;
