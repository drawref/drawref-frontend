import { useGetImageAuthorsQuery } from "../app/apiSlice";
import TheHeader from "../components/TheHeader";
import TheFooter from "../components/TheFooter";
import TheLoadingModal from "../components/TheLoadingModal";

function Credits() {
  const { data: authors, isLoading } = useGetImageAuthorsQuery();

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App bg-white">
        <TheHeader />
        <div id="content" className="bg-white text-center text-defaultText">
          <h1 className="mb-3 mt-10 flex items-center justify-center gap-2 text-3xl font-semibold">Credits</h1>
          <div className="mx-4 mb-8 mt-6 flex max-w-full items-start justify-center gap-6">
            <div className="basic-formatting box-border flex w-[35rem] max-w-full flex-col gap-3 border-[5px] border-slate-200 px-6 py-6 text-left text-lg shadow-card">
              {authors && authors.length > 0 && (
                <>
                  <p>Take a look at the creators of the images on this site:</p>
                  <ul className="ml-6 list-disc">
                    {authors.map((author) => (
                      <li key={`${author[0]} ${author[1]}`}>
                        <strong>{author[0]}</strong>
                        {author[1] && (
                          <>
                            {": "}
                            <a href={author[1]}>{author[1]}</a>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {(!authors || authors.length === 0) && <p>Image creators are listed on this page.</p>}
            </div>
          </div>
        </div>
        <TheFooter />
      </div>
    </>
  );
}

export default Credits;
