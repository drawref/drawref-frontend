import { useState } from "react";
import { useParams } from "react-router-dom";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import AdminCategoryInfoBox from "../components/AdminCategoryInfoBox";

import { useAppSelector } from "../app/hooks";
import {
  useGetCategoryQuery,
  useEditCategoryMutation,
  useGetCategoryImagesQuery,
  useDeleteImageFromCategoryMutation,
} from "../app/apiSlice";
import NotFound from "./NotFound";
import { parseError } from "../app/utilities";
import Pagination from "../components/Pagination";

type Params = {
  categoryId: string;
};

function AdminEditCategory() {
  const user = useAppSelector((state) => state.userProfile);

  const { categoryId } = useParams<Params>();
  if (!categoryId) {
    return <NotFound />;
  }

  const [imagesPage, setImagesPage] = useState(1);

  const { data: categoryData, isLoading } = useGetCategoryQuery(categoryId);
  const {
    data: categoryImages,
    isLoading: isLoadingCategoryImages,
    error: getCategoryImagesError,
  } = useGetCategoryImagesQuery({ category: categoryId, page: imagesPage - 1 });

  const [editCategory, { isLoading: isEditingCategory, error: categoryError }] = useEditCategoryMutation();
  const [deleteImageFromCategory] = useDeleteImageFromCategoryMutation();

  const categoryErrorToShow = categoryError ? `Couldn't edit category: ${parseError(categoryError)}` : "";

  return (
    <>
      {(isLoading || isEditingCategory) && <TheLoadingModal />}
      <div className="App dark bg-primary-950">
        <TheHeader admin={true} />
        <div id="content" className="bg-primary-950 text-center text-white">
          <h1 className="mb-6 mt-10 text-3xl font-semibold">Edit Category</h1>
          <div className="mx-4 mb-8 flex max-w-full items-start justify-center gap-6">
            {!isLoading && categoryData && (
              <AdminCategoryInfoBox
                name={categoryData.display_name || categoryData.id}
                coverId={categoryData.cover_image}
                tags={categoryData.tags}
                error={categoryErrorToShow}
                onSubmit={async (data) => {
                  if (data.display_name !== "") {
                    console.log("Editing category:", data);
                    try {
                      editCategory({ id: categoryId, token: user.token, body: data });
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}
              />
            )}
            <div className="flex w-[28em] flex-col gap-6">
              {!isLoadingCategoryImages && (
                <div className="box-border flex w-[28em] max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6">
                  <h2 className="text-xl font-medium">Images</h2>
                  <div className="flex justify-center">
                    <Pagination
                      totalPages={categoryImages?.total_pages || 0}
                      currentPage={imagesPage}
                      onPageSelected={(newPage) => setImagesPage(newPage)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {categoryImages &&
                      categoryImages.images.map((img) => (
                        <button
                          key={img.id}
                          className="h-20 w-20 rounded-lg bg-cover hover:border-8 hover:border-red-500 hover:blur"
                          data-image={img.id}
                          style={{ backgroundImage: `url(${encodeURI(img.path)})` }}
                          onClick={async (e) => {
                            try {
                              const imageId = (e.target as HTMLElement).dataset.image;
                              if (imageId) {
                                await deleteImageFromCategory({
                                  category: categoryId,
                                  image: parseInt(imageId),
                                  token: user.token,
                                });
                              }
                            } catch (err) {
                              console.error(err);
                              return;
                            }
                          }}
                        ></button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminEditCategory;
