import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiStepBackward, mdiStop, mdiPause, mdiStepForward, mdiHeart } from "@mdi/js";

import TheLoadingModal from "../components/TheLoadingModal";

import { useGetSessionQuery } from "../app/apiSlice";

function Session() {
  const navigate = useNavigate();
  const [showUi, setShowUi] = useState(true);
  const [showTime, setShowTime] = useState(true);

  // working session data
  const [onApiImages, setOnApiImages] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [historyImages, setHistoryImages] = useState([]);
  console.log("current index:", onApiImages ? "api" : "history", "image", currentImage);
  console.log("history length:", historyImages.length);

  // data for API call
  const [searchBarParams, setSearchBarParams] = useSearchParams();
  const categoryId = searchBarParams.get("category") || "";
  const metadata = JSON.parse(searchBarParams.get("metadata") || "{}");

  // session API info
  const { data: session, isLoading, refetch } = useGetSessionQuery();
  useEffect(() => {
    console.log("details:", categoryId, JSON.stringify(metadata));

    // grab brand new set of images when loading into a fresh session
    refetch();
  }, []);

  // get current image path from session, or from history
  const currentImagePath = onApiImages ? (session ? session[currentImage].path : "") : historyImages[currentImage].path;

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App z-0 bg-primary-950 text-white">
        <div
          className="absolute left-0 top-0 z-10 h-screen w-screen bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${currentImagePath})` }}
          onClick={() => setShowUi(!showUi)}
        ></div>
        <div
          className="absolute right-0 top-0 z-40 min-w-24 select-none rounded-bl-3xl bg-primary-900 bg-opacity-95 px-5 py-1.5 text-right text-lg"
          style={{ opacity: showTime ? 1 : 0.1 }}
          onClick={() => setShowTime(!showTime)}
        >
          00:00
        </div>
        {showUi && (
          <div className="absolute bottom-0 left-0 z-40 flex w-screen justify-center">
            <div className="flex min-h-8 min-w-20 justify-center rounded-t-3xl bg-primary-900 bg-opacity-95 px-2">
              <button
                type="button"
                className="py-2 pl-4 pr-1.5"
                onClick={() => {
                  if (currentImage === 0) {
                    if (onApiImages && historyImages.length > 0) {
                      setOnApiImages(false);
                      setCurrentImage(historyImages.length - 1);
                    } else {
                      setCurrentImage(session.length - 1);
                    }
                  } else {
                    setCurrentImage(currentImage - 1);
                  }
                }}
              >
                <Icon path={mdiStepBackward} title="Previous image" size={1.2} className="text-white" />
              </button>
              {/*TODO: on clicking this button we should show the 'are you sure' modal, don't just stop the session right away without warning */}
              <button type="button" className="px-1.5 py-2" onClick={() => navigate(`/c/${categoryId}`)}>
                <Icon path={mdiStop} title="Stop session" size={1.2} className="text-white" />
              </button>
              <button type="button" className="px-1.5 py-2">
                <Icon path={mdiPause} title="Pause session" size={1.2} className="text-white" />
              </button>
              <button
                type="button"
                className="py-2 pl-1.5 pr-3"
                onClick={() => {
                  if (onApiImages && currentImage === session.length - 1) {
                    console.log("setting new history value");
                    setHistoryImages(historyImages.concat(session));
                    refetch();
                    setCurrentImage(0);
                  } else if (!onApiImages && currentImage === historyImages.length - 1) {
                    setOnApiImages(true);
                    setCurrentImage(0);
                  } else {
                    setCurrentImage(currentImage + 1);
                  }
                }}
              >
                <Icon path={mdiStepForward} title="Next image" size={1.2} className="text-white" />
              </button>
              <button type="button" className="py-2.5 pl-3 pr-4">
                <Icon path={mdiHeart} title="Favourite" size={1} className="text-favouriteActive" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Session;
