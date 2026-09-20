import { useState } from "react";
import { useParams } from "react-router-dom";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import AdminCategoryInfoBox from "../components/AdminCategoryInfoBox";
import AdminImageActionModal from "../components/AdminImageActionModal";
import AdminImageModal from "../components/AdminImageModal";

import { useAppSelector } from "../app/hooks";
import { useGetCategoryQuery, useEditCategoryMutation, useGetCategoryImagesQuery } from "../app/apiSlice";
import NotFound from "./NotFound";
import { parseError } from "../app/utilities";
import Pagination from "../components/Pagination";
import { Image } from "../types/drawref";

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
  const [selectedImageForAction, setSelectedImageForAction] = useState<Image | null>(null);
  const [selectedImageForOverride, setSelectedImageForOverride] = useState<Image | null>(null);

  const { data: categoryData, isLoading } = useGetCategoryQuery(categoryId);
  const {
    data: categoryImages,
    isLoading: isLoadingCategoryImages,
    error: getCategoryImagesError,
  } = useGetCategoryImagesQuery({ category: categoryId, page: imagesPage - 1 });

  const [editCategory, { isLoading: isEditingCategory, error: categoryError }] = useEditCategoryMutation();

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
                          type="button"
                          key={img.id}
                          onClick={() => setSelectedImageForAction(img)}
                          className="group relative h-20 w-20 overflow-hidden rounded-lg bg-cover transition-all hover:scale-105 hover:ring-2 hover:ring-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                          data-image={img.id}
                          title={`Image #${img.id}${img.relative_path ? ` - ${img.relative_path}` : ""}`}
                          style={{
                            backgroundImage: `url(${encodeURI(
                              `${import.meta.env.VITE_DRAWREF_IMAGE || "http://localhost:3300/image/"}${img.id}?max=300`,
                            )})`,
                          }}
                        >
                          {categoryData?.cover_image === img.id && (
                            <span className="absolute inset-x-0 bottom-0 bg-primary-950/80 py-0.5 text-center text-[10px] font-semibold text-green-300">
                              Cover
                            </span>
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedImageForAction && (
          <AdminImageActionModal
            image={selectedImageForAction}
            isCover={categoryData?.cover_image === selectedImageForAction.id}
            isSettingCover={isEditingCategory}
            onSetCategoryCover={async () => {
              if (!categoryData) return;
              try {
                await editCategory({
                  id: categoryId,
                  token: user.token,
                  body: {
                    ...categoryData,
                    display_name: categoryData.display_name || categoryData.id,
                    tags: categoryData.tags || [],
                    cover_image: selectedImageForAction.id,
                  },
                }).unwrap();
                setSelectedImageForAction(null);
              } catch (err) {
                console.error(err);
                alert(`Failed to set category cover: ${parseError(err as any)}`);
              }
            }}
            onEditOverrides={() => {
              const img = selectedImageForAction;
              setSelectedImageForAction(null);
              setSelectedImageForOverride(img);
            }}
            onClose={() => setSelectedImageForAction(null)}
          />
        )}

        {selectedImageForOverride && (
          <AdminImageModal
            key={selectedImageForOverride.id}
            image={selectedImageForOverride}
            onClose={() => setSelectedImageForOverride(null)}
          />
        )}

        <TheFooter />
      </div>
    </>
  );
}

export default AdminEditCategory;
