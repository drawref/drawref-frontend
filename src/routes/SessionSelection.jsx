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
          <h1 className="mb-3 mt-10 text-3xl font-semibold">{category.name}</h1>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            {category.metadata &&
              Object.keys(category.metadata).map((key) => (
                <div key={key} className="flex justify-center gap-6">
                  <label className="text-lg font-semibold">{category.metadata[key].name}</label>
                  {/* <CheckboxGroup /> */}
                  <div className="flex gap-5">
                    {category.metadata[key].values.map((name) => (
                      <div key={name} className="flex items-center gap-2">
                        <input type="checkbox" id={`${key}.${name}`} name={`meta.${key}.${name}`} />
                        <label htmlFor={`${key}.${name}`} className="">
                          {name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            <button type="submit">Submit</button>
          </form>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default SessionSelection;
