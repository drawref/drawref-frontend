import { useState } from "react";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";

import { categoryTags } from "../app/tagTemplates";
import { useAddCategoryMutation } from "../app/apiSlice";
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
  const [addCategory, { isLoading: isUpdating }] = useAddCategoryMutation();

  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [tagsList, setTagsList] = useState("");

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
      {isUpdating && <TheLoadingModal />}
      <div className="App dark bg-primary-950">
        <TheHeader admin={true} />
        <div id="content" className="bg-primary-950 text-center text-white">
          <h1 className="mb-6 mt-10 text-3xl font-semibold">Create Category</h1>
          <div className="mx-4 flex">
            <form
              className="mx-auto mb-8 flex w-[28em] max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6"
              onSubmit={(e) => {
                e.preventDefault();
                const tags = parseTags(tagsList);
                const body = {
                  id: categoryId,
                  name: categoryName,
                  tags,
                };
                if (categoryId.trim() !== "" && categoryName.trim() !== "") {
                  console.log("submitting form:", body);
                  addCategory(body);
                }
              }}
            >
              <h2 className="text-xl font-medium">Information</h2>
              {/* note, unhide cover once implemented */}
              <div className="flex items-center justify-center gap-3 dark:hidden">
                <label htmlFor="coverImage" className="text-lg font-medium">
                  Cover
                </label>
                <input type="file" id="coverImage"></input>
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
