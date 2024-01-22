import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import AdminCategoryInfoBox from "../components/AdminCategoryInfoBox";
import SessionCheckboxGroup from "../components/SessionCheckboxGroup";

import {
  useGetCategoryQuery,
  useAddImageMutation,
  useAddImageToCategoryMutation,
  useEditCategoryMutation,
} from "../app/apiSlice";
import { useUploadImageMutation } from "../app/uploadSlice";

function AdminEditCategory() {
  const user = useSelector((state) => state.userProfile);
  const { categoryId } = useParams();
  const { data: categoryData, isLoading } = useGetCategoryQuery(categoryId);

  const [uploadTags, setUploadTags] = useState({});
  const [uploadFiles, setUploadFiles] = useState([]);

  const [editCategory, { isLoading: isEditingCategory, error: categoryError }] = useEditCategoryMutation();
  const [uploadImage, { isLoading: isUploadingImage, error: uploadImageError }] = useUploadImageMutation();
  const [addImage, { isLoading: isAddingImage, error: addImageError }] = useAddImageMutation();
  const [addImageToCategory, { isLoading: isAddingImageToCategory, error: addImageToCategoryError }] =
    useAddImageToCategoryMutation();

  const errorToShow = categoryError ? categoryError.data.error : "";

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
                name={categoryData.name}
                coverId={categoryData.cover_id}
                coverUrl={categoryData.cover}
                tags={categoryData.tags}
                error={errorToShow}
                onSubmit={async (data) => {
                  if (data.name !== "") {
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
            {!isLoading && categoryData && (
              <div className="box-border flex w-[28em] max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6">
                <h2 className="text-xl font-medium">Upload Images</h2>
                <div className="grid grid-cols-4 gap-x-4 gap-y-3">
                  <SessionCheckboxGroup tags={categoryData.tags} onChange={(tags) => setUploadTags(tags)} />
                </div>
                <input
                  type="file"
                  id="coverImage"
                  multiple
                  onChange={async (e) => {
                    // upload
                    setUploadFiles((state) => {
                      return state.concat([...e.target.files]);
                    });

                    for (const file of [...e.target.files]) {
                      try {
                        const fData = new FormData();
                        fData.append("image", file);
                        const uploadResult = await uploadImage({ token: user.token, body: fData }).unwrap();

                        if (uploadResult.path) {
                          // add image
                          const addResult = await addImage({
                            token: user.token,
                            body: {
                              path: uploadResult.path,
                              // author name and url
                              author: "",
                            },
                          });

                          // add image to category
                          const addToCatResult = await addImageToCategory({
                            category: categoryId,
                            image: addResult.data.id,
                            token: user.token,
                            body: {
                              tags: uploadTags,
                            },
                          });
                        }
                      } catch (err) {
                        console.error(err);
                        return;
                      }

                      // remove this file
                      setUploadFiles((state) => {
                        state = state.filter((f) => f !== file);
                        return state;
                      });
                    }
                  }}
                ></input>
                <p>{uploadFiles.length}</p>
              </div>
            )}
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminEditCategory;
