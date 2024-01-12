import { useLoaderData } from "react-router-dom";

import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import { useGetCategoriesQuery } from "../app/apiSlice";

export async function loader({ params }) {
  const categoryId = params.categoryId;
  return { categoryId };
}

function handleSubmit(event) {
  event.preventDefault();
  console.log(event);
}

function SessionSelection() {
  const { categoryId } = useLoaderData();
  const { data: categories, isLoading } = useGetCategoriesQuery();
  var category = categories ? categories.filter((cat) => cat.id === categoryId)[0] : {};

  console.log(category.metadata);

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="bg-white text-center text-defaultText">
          <h1 className="mb-6 mt-10 text-3xl font-semibold">{category.name}</h1>
          <form className="mb-6 flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="mx-auto grid grid-cols-4 gap-x-7 gap-y-5">
              {category.metadata &&
                Object.keys(category.metadata).map((key) => (
                  <>
                    <label className="text-right text-lg font-semibold">{category.metadata[key].name}</label>
                    <div className="col-span-3 flex gap-1.5">
                      {category.metadata[key].values.map((name) => (
                        <div key={name} className="flex items-center gap-1 rounded bg-primary-100 pl-3">
                          <input type="checkbox" id={`${key}.${name}`} name={`meta.${key}.${name}`} />
                          <label htmlFor={`${key}.${name}`} className="select-none py-1.5 pr-3 text-sm">
                            {name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </>
                ))}
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
                <option value="15m">15 minutes</option>
                <option value="30m">30 minutes</option>
                <option value="45m">45 minutes</option>
                <option value="1h">1 hour</option>
              </select>
              <label className="text-right text-lg font-semibold" htmlFor="interval">
                Interval
              </label>
              <select
                name="interval"
                id="interval"
                className="col-span-2 rounded bg-primary-100 px-1.5 py-1.5 text-sm text-defaultText"
              >
                <option value="30s">30 seconds</option>
                <option value="1m">1 minute</option>
                <option value="2m">2 minute</option>
                <option value="3m">3 minute</option>
                <option value="5m">5 minute</option>
                <option value="10m">10 minute</option>
                <option value="15m">15 minute</option>
                <option value="30m">30 minute</option>
                <option value="1h">1 hour</option>
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
