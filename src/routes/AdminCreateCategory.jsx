import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";

import { categoryTags } from "../app/tagTemplates";
import { useAddCategoryMutation, useAddImageMutation } from "../app/apiSlice";
import { upload, useUploadImageMutation } from "../app/uploadSlice";
import slugify from "slugify";

function parseTags(tagsList) {
  const tags = [];
  for (const line of tagsList.split("\n")) {
    var vals = line.split(":");

    var key = vals.shift();
    var id = slugify(key, "_");
    // advanced key name
    if (key.includes(">")) {
      [key, id] = key.split(">").map((v) => v.trim());
      id = slugify(id, "_");
    }

    vals = vals
      .join(":")
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k !== "");

    if (vals.length > 0) {
      tags.push({
        id: id.toLowerCase(),
        name: key,
        values: vals,
      });
    }
  }
  return tags;
}

function AdminCreateCategory() {
  const user = useSelector((state) => state.userProfile);

  const [addCategory, { isLoading: isUpdating, error: categoryError }] = useAddCategoryMutation();
  const [addImage, { isLoading: isAddingImage, error: addImageError }] = useAddImageMutation();
  const [uploadImage, { isLoading: isUploadingImage, error: uploadImageError }] = useUploadImageMutation();
  const navigate = useNavigate();

  const errorToShow = [categoryError, addImageError, uploadImageError]
    .filter((e) => e && e.data)
    .map((e) => e.data.error)
    .join(" ");

  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [tagsList, setTagsList] = useState("");
  const coverRef = useRef(null);

  function applyTagTemplate(key) {
    const value = categoryTags.filter((info) => info.name === key)[0];
    if (value) {
      // note, better way to do things would be to track whether the category
      //  name has been changed from a default/template value or left default.
      // if it's been changed, don't replace name, otherwise replace name.
      setCategoryName(value.name);
      setCategoryId(slugify(value.name, "_").toLowerCase());

      // if tags has been manually modified, we shouldask for confirmation
      //  before just replacing all the existing values like this.
      setTagsList(
        value.tags
          .trim()
          .split("\n")
          .map((l) => l.trim())
          .join("\n"),
      );
    }
  }

  return (
    <>
      {(isUpdating || isUploadingImage || isAddingImage) && <TheLoadingModal />}
      <div className="App dark bg-primary-950">
        <TheHeader admin={true} />
        <div id="content" className="bg-primary-950 text-center text-white">
          <h1 className="mb-6 mt-10 text-3xl font-semibold">Create Category</h1>
          <div className="mx-4 flex">
            <form
              className="mx-auto mb-8 flex w-[28em] max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6"
              onSubmit={async (e) => {
                e.preventDefault();

                // uploading category cover image
                var coverImageId = -1;
                if (coverRef.current.files.length > 0) {
                  try {
                    const data = new FormData();
                    data.append("image", coverRef.current.files[0]);
                    const uploadResult = await uploadImage({ token: user.token, body: data }).unwrap();

                    if (uploadResult.path) {
                      // add image
                      const addResult = await addImage({
                        token: user.token,
                        body: {
                          path: uploadResult.path,
                          author: "",
                        },
                      });

                      coverImageId = addResult.data.id;
                    }
                  } catch (err) {
                    console.error(err);
                    return;
                  }
                }

                const tags = parseTags(tagsList);
                const body = {
                  id: categoryId,
                  name: categoryName,
                  tags,
                };
                if (coverImageId !== -1) {
                  body.cover = coverImageId;
                }

                if (categoryId.trim() !== "" && categoryName.trim() !== "") {
                  try {
                    const result = await addCategory({ token: user.token, body }).unwrap();
                    // created successfully, move to the new category edit page
                    navigate(`/admin/c/${result.id}`);
                  } catch (err) {
                    console.error(err);
                  }
                }
              }}
            >
              <h2 className="text-xl font-medium">Information</h2>
              <div className="flex items-center justify-center gap-3">
                <label htmlFor="coverImage" className="text-lg font-medium">
                  Cover
                </label>
                <input type="file" id="coverImage" ref={coverRef}></input>
              </div>
              <div className="flex items-center justify-center gap-3">
                <label htmlFor="name" className="text-lg font-medium">
                  Name
                </label>
                <input
                  id="name"
                  className="rounded px-2 py-1 text-defaultText"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    setCategoryId(slugify(e.target.value, "_").toLowerCase());
                  }}
                ></input>
              </div>

              <h2 className="mb-1 mt-5 text-xl font-medium">Tags</h2>
              <p className="-mt-4 text-balance">
                Note: One line per category. Individual tags are separated by commas.
              </p>
              <textarea
                className="rounded-lg px-3 py-2 text-defaultText"
                value={tagsList}
                onChange={(e) => setTagsList(e.target.value)}
              ></textarea>
              <div className="flex items-center justify-center gap-3">
                <label htmlFor="tagTemplate" className="text-lg font-medium">
                  Use template
                </label>
                <select
                  id="tagTemplate"
                  className="col-span-2 rounded bg-primary-100 px-1.5 py-1.5 text-sm text-defaultText"
                  onChange={(e) => applyTagTemplate(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {categoryTags.map((info) => (
                    <option key={info.name} value={info.name}>
                      {info.name}
                    </option>
                  ))}
                </select>
              </div>

              {errorToShow && (
                <span className="mx-auto -mb-5 mt-3 w-auto bg-red-600 px-3 py-1 text-sm">Error: {errorToShow}</span>
              )}

              <button
                type="submit"
                className="mx-auto mt-6 rounded bg-secondary-500 px-5 py-1.5 text-sm text-white shadow"
              >
                Save
              </button>
            </form>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default AdminCreateCategory;
