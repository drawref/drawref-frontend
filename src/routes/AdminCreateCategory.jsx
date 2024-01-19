import { useState } from "react";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";

import { categoryTags } from "../app/tagTemplates";

function AdminCreateCategory() {
  const [tagsList, setTagsList] = useState("");

  function applyTagTemplate(key) {
    const value = categoryTags.filter((info) => info.name === key)[0];
    if (value) {
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
      <div className="App dark bg-primary-950">
        <TheHeader admin={true} />
        <div id="content" className="bg-primary-950 text-center text-white">
          <h1 className="mb-6 mt-10 text-3xl font-semibold">Create Category</h1>
          <div className="mx-4 flex">
            <form className="mx-auto mb-8 flex w-[28em] max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6">
              <h2 className="text-xl font-medium">Information</h2>
              <div className="flex items-center justify-center gap-3">
                <label htmlFor="coverImage" className="text-lg font-medium">
                  Cover
                </label>
                <input type="file" id="coverImage"></input>
              </div>
              <div className="flex items-center justify-center gap-3">
                <label htmlFor="name" className="text-lg font-medium">
                  Name
                </label>
                <input id="name" className="rounded px-2 py-1 text-defaultText"></input>
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
                  Tag template
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
