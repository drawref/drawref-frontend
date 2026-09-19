import { useState } from "react";
import slugify from "slugify";

import { Category, Tag } from "../types/drawref";

function stringifyTags(tagsList: Tag[]): string {
  var tagStrings = [];

  for (const info of tagsList) {
    const values = info.values.join(", ");
    const assembledId = slugify(info.name, "_").toLowerCase();
    const final = assembledId === info.id ? `${info.name}: ${values}` : `${info.name} > ${info.id}: ${values}`;
    tagStrings.push(final);
  }

  return tagStrings.join("\n");
}

function parseTags(tagsList: string): Tag[] {
  const tags: Tag[] = [];
  for (const line of tagsList.split("\n")) {
    var vals = line.split(":");

    var key = vals.shift() || "";
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

interface Props {
  name?: string;
  coverId?: number;
  coverUrl?: string;
  tags?: Tag[];
  onSubmit(data: Category): void;
  error: string;
}

function AdminCategoryInfoBox({ name, coverId, coverUrl, tags, onSubmit, error }: Props) {
  const [cName, setCName] = useState(name || "");
  const [cCoverId, setCCoverId] = useState<number | undefined>(coverId);
  const [cTags, setCTags] = useState(stringifyTags(tags || []));

  const errorToShow = error;

  return (
    <form
      className="box-border flex w-[28em] max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6"
      onSubmit={async (e) => {
        e.preventDefault();

        const data: Category = {
          id: slugify(cName.trim(), "_").toLowerCase(),
          display_name: cName.trim(),
          tags: parseTags(cTags),
        };

        if (cCoverId !== undefined) {
          data.cover_image = cCoverId;
        }

        onSubmit(data);
      }}
    >
      <h2 className="text-xl font-medium">Information</h2>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <label htmlFor="coverImage" className="text-lg font-medium">
          Cover Image ID
        </label>
        <input
          id="coverImage"
          type="number"
          className="max-w-full rounded px-2 py-1 text-defaultText"
          value={cCoverId !== undefined ? cCoverId : ""}
          onChange={(e) => {
            setCCoverId(parseInt(e.target.value) || undefined);
          }}
        ></input>
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

      <p className="mt-4 text-center font-semibold text-red-500">{errorToShow}</p>

      <button className="mt-2 block w-full rounded bg-primary-700 py-3 text-lg font-bold text-white hover:bg-primary-600">
        Save
      </button>
    </form>
  );
}

export default AdminCategoryInfoBox;
