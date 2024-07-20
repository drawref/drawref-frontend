import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";

import { useGetImageSourcesQuery } from "../app/apiSlice";

function Credits() {
  const { data: sources, isLoading } = useGetImageSourcesQuery();

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="bg-white text-center text-defaultText">
          <h1 className="mb-3 mt-10 flex items-center justify-center gap-2 text-3xl font-semibold">Credits</h1>
          <div className="mx-4 mb-8 mt-6 flex max-w-full items-start justify-center gap-6">
            <div className="basic-formatting box-border flex w-[35rem] max-w-full flex-col gap-3 border-[5px] border-slate-200 px-6 py-6 text-left text-lg shadow-card">
              {sources && sources.length > 0 && (
                <>
                  <p>Take a look at the sources for the images on this site:</p>
                  <ul className="ml-6 list-disc">
                    {sources.map((source) => (
                      <li key={`${source[0]} ${source[1]}`}>
                        <strong>{source[0]}</strong>
                        {source[1] && (
                          <>
                            {": "}
                            <a href={source[1]}>{source[1]}</a>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {sources && sources.length === 0 && <p>Image authors are listed on this page.</p>}
            </div>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default Credits;
