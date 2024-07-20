import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";
import LandingCategoryCard from "../components/LandingCategoryCard";

import { useGetCategoriesQuery } from "../app/apiSlice";

function Landing() {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="bg-white text-center text-defaultText">
          <h1 className="mb-3 mt-10 text-3xl font-semibold">Select a category</h1>
          <div className="mx-auto my-8 flex w-[60rem] max-w-full flex-wrap items-center justify-center gap-8 px-4 md:gap-12">
            {categories &&
              categories.map((cat) => (
                <LandingCategoryCard key={cat.id} categoryKey={cat.id} name={cat.name} imageUrl={cat.cover} />
              ))}
            {categories && categories.length === 0 && <span>No categories exist, login to add one!</span>}
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default Landing;
