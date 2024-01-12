import { useSearchParams } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiStepBackward, mdiStop, mdiPause, mdiStepForward, mdiHeart } from "@mdi/js";

import TheLoadingModal from "../components/TheLoadingModal";

import { useGetSessionQuery } from "../app/apiSlice";

function Session() {
  const [searchBarParams, setSearchBarParams] = useSearchParams();
  const categoryId = searchBarParams.get("category") || "";
  const metadata = JSON.parse(searchBarParams.get("metadata") || "{}");

  console.log("details:", categoryId, JSON.stringify(metadata));

  const { data: session, isLoading } = useGetSessionQuery();
  console.log(session[0]);

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App z-0 bg-primary-950 text-white">
        {session && session[0] && (
          <div
            className="absolute left-0 top-0 z-10 h-screen w-screen bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${session[0].path})` }}
          ></div>
        )}
        <div className="absolute right-0 top-0 z-40 min-w-24 rounded-bl-3xl bg-primary-900 bg-opacity-95 px-5 py-1.5 text-right text-lg">
          00:00
        </div>
        <div className="absolute bottom-0 left-0 z-40 flex w-screen justify-center">
          <div className="flex min-h-8 min-w-20 justify-center rounded-t-3xl bg-primary-900 bg-opacity-95 px-2">
            <button type="button" className="py-2 pl-4 pr-1.5">
              <Icon path={mdiStepBackward} title="Previous image" size={1.2} className="text-white" />
            </button>
            <button type="button" className="px-1.5 py-2">
              <Icon path={mdiStop} title="Stop session" size={1.2} className="text-white" />
            </button>
            <button type="button" className="px-1.5 py-2">
              <Icon path={mdiPause} title="Pause session" size={1.2} className="text-white" />
            </button>
            <button type="button" className="py-2 pl-1.5 pr-3">
              <Icon path={mdiStepForward} title="Next image" size={1.2} className="text-white" />
            </button>
            <button type="button" className="py-2.5 pl-3 pr-4">
              <Icon path={mdiHeart} title="Favourite" size={1} className="text-favouriteActive" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Session;
