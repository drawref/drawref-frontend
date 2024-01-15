import { useState } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { classLengths, staticImageTimes } from "../app/sessionTimes";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import { useGetCategoriesQuery } from "../app/apiSlice";
import SessionCheckboxGroup from "../components/SessionCheckboxGroup";

export async function loader({ params }) {
  const categoryId = params.categoryId;
  return { categoryId };
}

function handleSubmit(categoryId, rawMetadata, timing, navigate, searchBarParams, setSearchBarParams, event) {
  event.preventDefault();

  // turn metadata objects into a simple [key: array] of chosen values
  var metadata = {};
  for (const [key, vals] of Object.entries(rawMetadata)) {
    const entriesList = Object.entries(vals)
      .filter(([_, v]) => v)
      .map(([k]) => k);
    if (entriesList.length > 0) {
      metadata[key] = entriesList;
    }
  }

  navigate(`/session`);
  searchBarParams.set("category", categoryId);
  searchBarParams.set("metadata", JSON.stringify(metadata));
  searchBarParams.set("timing", JSON.stringify(timing));
  setSearchBarParams(searchBarParams);
}

function SessionSelection() {
  const [timingType, setTimingType] = useState("static");
  const [staticTime, setStaticTime] = useState("5m");
  const [classLength, setClassLength] = useState("15m");

  const navigate = useNavigate();
  const [searchBarParams, setSearchBarParams] = useSearchParams();

  const { categoryId } = useLoaderData();
  const { data: categories, isLoading } = useGetCategoriesQuery();
  var category = categories ? categories.filter((cat) => cat.id === categoryId)[0] : {};

  const metadata = useSelector((state) => state.sessionMetadata.metadata);
  const timing = {
    timingType,
    staticTime,
    classLength,
  };

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="bg-white text-center text-defaultText">
          <h1 className="mb-6 mt-10 text-3xl font-semibold">{category.name}</h1>
          <form
            className="mb-6 flex flex-col gap-3"
            onSubmit={handleSubmit.bind(
              null,
              categoryId,
              metadata,
              timing,
              navigate,
              searchBarParams,
              setSearchBarParams,
            )}
          >
            <div className="mx-auto grid grid-cols-4 gap-x-7 gap-y-5">
              {category.metadata && <SessionCheckboxGroup categoryId={categoryId} metadata={category.metadata} />}
            </div>

            <hr className="mx-auto my-4 h-1.5 w-32 rounded border-none bg-slate-300" />

            <div className="mx-auto grid grid-cols-3 gap-x-7 gap-y-3">
              <label className="text-right text-lg font-semibold" htmlFor="timing">
                Timing
              </label>
              <select
                name="timing"
                id="timing"
                className="col-span-2 rounded bg-primary-100 px-1.5 py-1.5 text-sm text-defaultText"
                value={timingType}
                onChange={(e) => setTimingType(e.target.value)}
              >
                <option value="class">Class mode</option>
                <option value="static">Static</option>
              </select>
              {timingType === "class" && (
                <>
                  <label className="text-right text-lg font-semibold" htmlFor="classLength">
                    Class length
                  </label>
                  <select
                    name="classLength"
                    id="classLength"
                    className="col-span-2 rounded bg-primary-100 px-1.5 py-1.5 text-sm text-defaultText"
                    value={classLength}
                    onChange={(e) => setClassLength(e.target.value)}
                  >
                    {classLengths.map((info) => (
                      <option key={info.value} value={info.value}>
                        {info.display}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {timingType === "static" && (
                <>
                  <label className="text-right text-lg font-semibold" htmlFor="interval">
                    Interval
                  </label>
                  <select
                    name="interval"
                    id="interval"
                    className="col-span-2 rounded bg-primary-100 px-1.5 py-1.5 text-sm text-defaultText"
                    value={staticTime}
                    onChange={(e) => setStaticTime(e.target.value)}
                  >
                    {staticImageTimes.map((info) => (
                      <option key={info.value} value={info.value}>
                        {info.display}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <button
              type="submit"
              className="mx-auto mt-4 rounded bg-secondary-500 px-5 py-1.5 text-sm text-white shadow"
            >
              Start session
            </button>
          </form>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default SessionSelection;
