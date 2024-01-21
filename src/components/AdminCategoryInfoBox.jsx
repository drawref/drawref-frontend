import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import slugify from "slugify";

import { categoryTags } from "../app/tagTemplates";
import { useAddImageMutation } from "../app/apiSlice";
import { useUploadImageMutation } from "../app/uploadSlice";

function stringifyTags(tagsList) {
  var tagStrings = [];

  for (const info of tagsList) {
    const values = info.values.join(", ");
    const assembledId = slugify(info.name, "_").toLowerCase();
    const final = assembledId === info.id ? `${info.name}: ${values}` : `${info.name} > ${info.id}: ${values}`;
    tagStrings.push(final);
  }

  return tagStrings.join("\n");
}

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

function AdminCategoryInfoBox({ name, coverId, coverUrl, tags, onSubmit, error }) {
  const user = useSelector((state) => state.userProfile);

  const [cName, setCName] = useState(name || "");
  const [cCoverId, setCCoverId] = useState(coverId);
  const [cCoverUrl, setCCoverUrl] = useState(coverUrl || "");
  const [cTags, setCTags] = useState(stringifyTags(tags || []));

  const coverRef = useRef(null);

  const [addImage, { isLoading: isAddingImage, error: addImageError }] = useAddImageMutation();
  const [uploadImage, { isLoading: isUploadingImage, error: uploadImageError }] = useUploadImageMutation();

  const otherTextErrors = [addImageError, uploadImageError].filter((e) => e && e.data).map((e) => e.data.error);
  const errorToShow = [error, otherTextErrors].join(" ").trim();

  function applyTagTemplate(key) {
    const value = categoryTags.filter((info) => info.name === key)[0];
    if (value) {
      // note, better way to do things would be to track whether the category
      //  name has been changed from a default/template value or left default.
      // if it's been changed, don't replace name, otherwise replace name.
      setCName(value.name);

      // if tags has been manually modified, we shouldask for confirmation
      //  before just replacing all the existing values like this.
      setCTags(
        value.tags
          .trim()
          .split("\n")
          .map((l) => l.trim())
          .join("\n"),
      );
    }
  }

  return (
    <form
      className="mx-auto mb-8 box-border flex w-[28em] max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6"
      onSubmit={async (e) => {
        e.preventDefault();

        const data = {
          id: slugify(cName.trim(), "_").toLowerCase(),
          name: cName.trim(),
          tags: parseTags(cTags),
        };

        if (cCoverUrl !== "") {
          data.cover = cCoverId;
        } else if (coverRef.current.files.length > 0) {
          try {
            const fData = new FormData();
            fData.append("image", coverRef.current.files[0]);
            const uploadResult = await uploadImage({ token: user.token, body: fData }).unwrap();

            if (uploadResult.path) {
              // add image
              const addResult = await addImage({
                token: user.token,
                body: {
                  path: uploadResult.path,
                  author: "",
                },
              });

              data.cover = addResult.data.id;
              setCCoverId(addResult.data.id);
              setCCoverUrl(addResult.data.url);
            }
          } catch (err) {
            console.error(err);
            return;
          }
        }

        onSubmit(data);
      }}
    >
      <h2 className="text-xl font-medium">Information</h2>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <label htmlFor="coverImage" className="text-lg font-medium">
          Cover
        </label>
        {cCoverUrl && (
          <>
            <img src={cCoverUrl} className="h-10" />
            <button
              onClick={() => {
                setCCoverId(undefined);
                setCCoverUrl("");
              }}
            >
              Remove Cover
            </button>
          </>
        )}
        {!cCoverUrl && <input type="file" id="coverImage" ref={coverRef}></input>}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <label htmlFor="name" className="text-lg font-medium">
          Name
        </label>
        <input
          id="name"
          className="max-w-full rounded px-2 py-1 text-defaultText"
          value={cName}
          onChange={(e) => {
            setCName(e.target.value);
          }}
        ></input>
      </div>

      <h2 className="mb-1 mt-5 text-xl font-medium">Tags</h2>
      <p className="-mt-4 text-balance">Note: One line per category. Individual tags are separated by commas.</p>
      <textarea
        className="rounded-lg px-3 py-2 text-defaultText"
        value={cTags}
        onChange={(e) => setCTags(e.target.value)}
      ></textarea>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
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
        disabled={false}
      >
        Save
      </button>
    </form>
  );
}
AdminCategoryInfoBox.propTypes = {
  name: PropTypes.string,
  coverId: PropTypes.number,
  coverUrl: PropTypes.string,
  tags: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default AdminCategoryInfoBox;
