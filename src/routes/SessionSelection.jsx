import { useLoaderData } from "react-router-dom";
import { useSelector } from "react-redux";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import { useGetCategoriesQuery } from "../app/apiSlice";
import SessionCheckboxGroup from "../components/SessionCheckboxGroup";

export async function loader({ params }) {
  const categoryId = params.categoryId;
  return { categoryId };
}

function handleSubmit(categoryId, rawMetadata, event) {
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

  // we'll put this into the # fragment of the url when getting a session
  console.log(
    categoryId,
    JSON.stringify({
      metadata,
    }),
  );
}

//TODO: move these elsewhere - these will need to contain lots more detail
// about specific image lengths to get sessions working.
const classLengths = [
  {
    value: "15m",
    display: "15 minutes",
  },
  {
    value: "30m",
    display: "30 minutes",
  },
  {
    value: "45m",
    display: "45 minutes",
  },
  {
    value: "1h",
    display: "1 hour",
  },
];

//TODO: move these elsewhere, they will need to contain exact durations that
// we can use to calculate remaining time on the current image.
const imageIntervals = [
  {
    value: "30s",
    display: "30 seconds",
  },
  {
    value: "1m",
    display: "1 minute",
  },
  {
    value: "2m",
    display: "2 minutes",
  },
  {
    value: "5m",
    display: "5 minutes",
  },
  {
    value: "10m",
    display: "10 minutes",
  },
  {
    value: "15m",
    display: "15 minutes",
  },
  {
    value: "30m",
    display: "30 minutes",
  },
  {
    value: "1h",
    display: "1 hour",
  },
];

function SessionSelection() {
  const { categoryId } = useLoaderData();
  const { data: categories, isLoading } = useGetCategoriesQuery();
  var category = categories ? categories.filter((cat) => cat.id === categoryId)[0] : {};

  const metadata = useSelector((state) => state.sessionMetadata.metadata);

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="bg-white text-center text-defaultText">
          <h1 className="mb-6 mt-10 text-3xl font-semibold">{category.name}</h1>
          <form className="mb-6 flex flex-col gap-3" onSubmit={handleSubmit.bind(null, categoryId, metadata)}>
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
              >
                <option value="class">Class mode</option>
                <option value="static">Static</option>
              </select>
              <label className="text-right text-lg font-semibold" htmlFor="classLength">
                Class length
              </label>
              <select
                name="classLength"
                id="classLength"
                className="col-span-2 rounded bg-primary-100 px-1.5 py-1.5 text-sm text-defaultText"
              >
                {classLengths.map((info) => (
                  <option key={info.value} value={info.value}>
                    {info.display}
                  </option>
                ))}
              </select>
              <label className="text-right text-lg font-semibold" htmlFor="interval">
                Interval
              </label>
              <select
                name="interval"
                id="interval"
                className="col-span-2 rounded bg-primary-100 px-1.5 py-1.5 text-sm text-defaultText"
              >
                {imageIntervals.map((info) => (
                  <option key={info.value} value={info.value}>
                    {info.display}
                  </option>
                ))}
              </select>
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
