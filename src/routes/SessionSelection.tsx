import { FormEvent, useState } from "react";
import { createSearchParams, NavigateFunction, Params, useLoaderData, useNavigate } from "react-router-dom";

import { TagMap, TimingData } from "../types/drawref";
import { classLengths, staticImageTimes } from "../app/sessionTimes";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import { useGetAvailableImageCountQuery, useGetCategoriesQuery, useGetSourcesQuery } from "../app/apiSlice";
import SessionCheckboxGroup from "../components/SessionCheckboxGroup";
import { useDebouncedState } from "../app/useDebouncedState";
import { useAppSelector } from "../app/hooks";

export async function loader({ params }: { params: Params<"categoryId"> }) {
  const categoryId = params.categoryId;
  return { categoryId };
}

function handleSubmit(
  category: string,
  tags: TagMap,
  timing: TimingData,
  source: string,
  navigate: NavigateFunction,
  event: FormEvent<HTMLFormElement>,
) {
  event.preventDefault();

  const searchBarParams: Record<string, string> = {
    category,
    tags: JSON.stringify(tags),
    timing: JSON.stringify(timing),
  };
  if (source) {
    searchBarParams.source = source;
  }
  navigate({
    pathname: `/session`,
    search: `?${createSearchParams(searchBarParams)}`,
  });
}

function SessionSelection() {
  const user = useAppSelector((state) => state.userProfile);
  const isAdmin = user.loggedIn && user.admin;

  const [timingType, setTimingType] = useState("static");
  const [staticTime, setStaticTime] = useState("5m");
  const [classLength, setClassLength] = useState("15m");
  const [tags, setTags] = useState<TagMap>({});
  const [selectedSource, setSelectedSource] = useState("");
  const [debouncedTags, setDebouncedTags, isWaitingToUpdateTags] = useDebouncedState<TagMap>({}, 700);

  const navigate = useNavigate();

  const { categoryId } = useLoaderData() as { categoryId: string };
  const { data: categories, isLoading } = useGetCategoriesQuery();
  var category = categories && categories.filter((cat) => cat.id === categoryId)[0];

  const { data: sources } = useGetSourcesQuery({ token: user.token }, { skip: !isAdmin });

  const activeSource = isAdmin ? selectedSource : "";

  const { data: availableImageData, isFetching: isFetchingAvailableImageData } = useGetAvailableImageCountQuery({
    category: categoryId,
    tags: debouncedTags,
    source: activeSource ? parseInt(activeSource, 10) : undefined,
  });
  var availableImages = availableImageData ? availableImageData.images : "unknown";
  var loadingAvailableImages = isWaitingToUpdateTags || isFetchingAvailableImageData;

  const timing: TimingData = {
    timingType,
    staticTime,
    classLength,
  };

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App bg-white">
        <TheHeader />
        {category && (
          <div id="content" className="bg-white text-center text-defaultText">
            <h1 className="mb-6 mt-10 text-3xl font-semibold">{category.display_name || category.id}</h1>
            <form
              className="mb-6 flex flex-col gap-3"
              onSubmit={handleSubmit.bind(null, categoryId, tags, timing, activeSource, navigate)}
            >
              <div className="mx-auto grid grid-cols-4 gap-x-7 gap-y-4">
                {category.tags && (
                  <SessionCheckboxGroup
                    tags={category.tags}
                    onChange={(tags) => {
                      setTags(tags);
                      setDebouncedTags(tags);
                    }}
                  />
                )}
              </div>

              <div className="-mb-2 mt-1.5 text-defaultText opacity-90 dark:text-white">
                {loadingAvailableImages ? `... loading ...` : `${availableImages} available images`}
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
                {isAdmin && (
                  <>
                    <label className="text-right text-lg font-semibold" htmlFor="source">
                      Source
                    </label>
                    <select
                      name="source"
                      id="source"
                      className="col-span-2 rounded bg-primary-100 px-1.5 py-1.5 text-sm text-defaultText"
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value)}
                    >
                      <option value="">All sources</option>
                      {sources &&
                        sources.map((src) => (
                          <option key={src.id} value={src.id}>
                            {src.name}
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
        )}
        <TheFooter />
      </div>
    </>
  );
}

export default SessionSelection;
