import { useState } from "react";
import { useParams } from "react-router-dom";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import AdminCategoryInfoBox from "../components/AdminCategoryInfoBox";
import SessionCheckboxGroup from "../components/SessionCheckboxGroup";

import { useAppSelector } from "../app/hooks";
import {
  useGetCategoryQuery,
  useAddImageMutation,
  useAddImageToCategoryMutation,
  useEditCategoryMutation,
  useGetCategoryImagesQuery,
  useDeleteImageFromCategoryMutation,
  useImportImageFolderMutation,
  useGetImageSourcesQuery,
} from "../app/apiSlice";
import { useUploadImageMutation } from "../app/uploadSlice";
import NotFound from "./NotFound";
import { TagMap } from "../types/drawref";
import { parseError } from "../app/utilities";

type Params = {
  categoryId: string;
};

function AdminEditCategory() {
  const user = useAppSelector((state) => state.userProfile);

  const { categoryId } = useParams<Params>();
  if (!categoryId) {
    return <NotFound />;
  }

  const { data: categoryData, isLoading } = useGetCategoryQuery(categoryId);
  const {
    data: categoryImages,
    isLoading: isLoadingCategoryImages,
    error: getCategoryImagesError,
  } = useGetCategoryImagesQuery({ category: categoryId, page: 0 });

  const [existingAuthor, setExistingAuthor] = useState("");
  const [typeOfUpload, setTypeOfUpload] = useState("upload");
  const [uploadTags, setUploadTags] = useState<TagMap>({});
  const [uploadAuthorName, setUploadAuthorName] = useState("");
  const [uploadAuthorUrl, setUploadAuthorUrl] = useState("");
  const [importFolder, setImportFolder] = useState("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const { data: sources, isLoading: isLoadingSources } = useGetImageSourcesQuery();
  const [editCategory, { isLoading: isEditingCategory, error: categoryError }] = useEditCategoryMutation();
  const [uploadImage, { isLoading: isUploadingImage, error: uploadImageError }] = useUploadImageMutation();
  const [addImage, { isLoading: isAddingImage, error: addImageError }] = useAddImageMutation();
  const [addImageToCategory, { isLoading: isAddingImageToCategory, error: addImageToCategoryError }] =
    useAddImageToCategoryMutation();
  const [importImageFolder, { isLoading: isImportingImageFolder, error: importImageFolderError }] =
    useImportImageFolderMutation();
  const [deleteImageFromCategory] = useDeleteImageFromCategoryMutation();

  const isUploadingImages = isUploadingImage || isAddingImage || isAddingImageToCategory || isImportingImageFolder;

  const categoryErrorToShow = categoryError ? `Couldn't edit category: ${parseError(categoryError)}` : "";

  return (
    <>
      {(isLoading || isEditingCategory || isLoadingSources) && <TheLoadingModal />}
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
                error={categoryErrorToShow}
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
            <div className="flex w-[28em] flex-col gap-6">
              {!isLoading && categoryData && (
                <div className="box-border flex max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6">
                  <h2 className="text-xl font-medium">Upload Images</h2>
                  <div className="grid grid-cols-4 gap-x-4 gap-y-3">
                    <SessionCheckboxGroup tags={categoryData.tags} onChange={(tags) => setUploadTags(tags)} />
                  </div>
                  <div className="grid grid-cols-4 gap-x-4 gap-y-3">
                    <label htmlFor="existingAuthorSelect" className="text-lg font-medium">
                      Author
                    </label>
                    <select
                      id="existingAuthorSelect"
                      className="col-span-3 rounded bg-primary-100 px-1.5 py-1.5 text-sm text-defaultText"
                      value={existingAuthor}
                      onChange={(e) => {
                        setExistingAuthor(e.target.value);
                        if (sources && e.target.value !== "") {
                          const [aname, aurl] = sources[parseInt(e.target.value)];
                          setUploadAuthorName(aname);
                          setUploadAuthorUrl(aurl);
                        }
                      }}
                    >
                      <option value="">New author</option>
                      {sources?.map((source, i) => (
                        <option key={i} value={i}>
                          {source[0]}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="author-name" className="col-span-2 text-lg font-medium">
                      Author name
                    </label>
                    <input
                      id="author-name"
                      className="col-span-2 rounded px-2 py-1 text-defaultText"
                      value={uploadAuthorName}
                      onChange={(e) => setUploadAuthorName(e.target.value)}
                    ></input>
                    <label htmlFor="author-url" className="col-span-2 text-lg font-medium">
                      Author URL
                    </label>
                    <input
                      id="author-url"
                      className="col-span-2 rounded px-2 py-1 text-defaultText"
                      placeholder="Author's URL"
                      value={uploadAuthorUrl}
                      onChange={(e) => setUploadAuthorUrl(e.target.value)}
                    ></input>
                  </div>
                  <div className="flex gap-3">
                    <label htmlFor="typeOfUpload" className="text-lg font-medium">
                      Image source
                    </label>
                    <select
                      id="typeOfUpload"
                      className="col-span-2 rounded bg-primary-100 px-1.5 py-1.5 text-sm text-defaultText"
                      value={typeOfUpload}
                      onChange={(e) => setTypeOfUpload(e.target.value)}
                      disabled={isUploadingImages}
                    >
                      <option value="upload">Upload</option>
                      <option value="local">Local folder</option>
                    </select>
                  </div>
                  {typeOfUpload == "local" && (
                    <div className="box-border flex max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-3 py-2">
                      <label htmlFor="localUploadFolder" className="text-lg font-medium">
                        Folder on the server:
                      </label>
                      <input
                        id="localUploadFolder"
                        className="col-span-3 -mt-2 rounded px-2 py-1 text-defaultText"
                        placeholder="/drawref/images/1"
                        value={importFolder}
                        onChange={(e) => setImportFolder(e.target.value)}
                      ></input>
                      <button
                        type="submit"
                        className="mx-auto mt-1 rounded bg-secondary-500 px-5 py-1.5 text-sm text-white shadow"
                        disabled={false}
                        onClick={() => {
                          console.log("UPLOADING!");
                          importImageFolder({
                            token: user.token,
                            body: {
                              folder: importFolder,
                              author: uploadAuthorName,
                              author_url: uploadAuthorUrl,
                              category: categoryId,
                              tags: uploadTags,
                            },
                          });
                        }}
                      >
                        Import
                      </button>
                    </div>
                  )}
                  {typeOfUpload == "upload" && (
                    <div className="box-border flex max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-3 py-2">
                      <input
                        type="file"
                        id="coverImage"
                        multiple
                        onChange={async (e) => {
                          // upload
                          setUploadFiles((state) => {
                            if (e.target.files === null) {
                              return state;
                            }
                            return state.concat([...e.target.files]);
                          });

                          if (e.target.files === null) {
                            return;
                          }

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
                                    author: uploadAuthorName,
                                    author_url: uploadAuthorUrl,
                                  },
                                });
                                if ("error" in addResult) {
                                  throw addResult.error;
                                }

                                // add image to category
                                const addToCatResult = await addImageToCategory({
                                  category: categoryId,
                                  image: addResult.data.id,
                                  token: user.token,
                                  body: {
                                    tags: uploadTags,
                                  },
                                });
                                if ("error" in addToCatResult) {
                                  throw addToCatResult.error;
                                }
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
                      <p>Images remaining: {uploadFiles.length}</p>
                    </div>
                  )}
                  {uploadImageError && (
                    <span className="mx-auto -mb-2 w-auto bg-red-600 px-3 py-1 text-sm">
                      Coule not upload image: {parseError(uploadImageError)}
                    </span>
                  )}
                  {addImageError && (
                    <span className="mx-auto -mb-2 w-auto bg-red-600 px-3 py-1 text-sm">
                      Could not add image: {parseError(addImageError)}
                    </span>
                  )}
                  {addImageToCategoryError && (
                    <span className="mx-auto -mb-2 w-auto bg-red-600 px-3 py-1 text-sm">
                      Could not add image to category: {parseError(addImageToCategoryError)}
                    </span>
                  )}
                  {importImageFolderError && (
                    <span className="mx-auto -mb-2 w-auto bg-red-600 px-3 py-1 text-sm">
                      Could not import image folder: {parseError(importImageFolderError)}
                    </span>
                  )}
                </div>
              )}
              {!isLoadingCategoryImages && (
                <div className="box-border flex w-[28em] max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6">
                  <h2 className="text-xl font-medium">Images</h2>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {categoryImages &&
                      categoryImages.map((img) => (
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
