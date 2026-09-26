import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiStepBackward, mdiStop, mdiPause, mdiPlay, mdiStepForward, mdiHeart } from "@mdi/js";

import TheLoadingModal from "../components/TheLoadingModal";
import SessionTimer from "../components/SessionTimer";

import { useInitialViewportTarget } from "../hooks/useInitialViewportTarget";
import { useImageZoom } from "../hooks/useImageZoom";
import { useGetSessionQuery } from "../app/apiSlice";
import { staticImageTimes, classLengths } from "../app/sessionTimes";
import { useTimer } from "../app/useTimer";
import { Image } from "../types/drawref";

function Session() {
  const navigate = useNavigate();
  const [searchBarParams, setSearchBarParams] = useSearchParams();
  const [showUi, setShowUi] = useState(true);

  // get the initial viewport size for image request sizing
  const imageSize = useInitialViewportTarget();

  // clicking buttons from timer actions
  const stopButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // working session data
  const [onApiImages, setOnApiImages] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [historyImages, setHistoryImages] = useState<Image[]>([]);

  // timer data
  const [timerRunning, setTimerRunning] = useState(true);
  const timing = JSON.parse(searchBarParams.get("timing") || "{}");
  var defaultSecondsList: number[] = [];
  // the [].concat() stops useTimer from modifying the base lists
  if (timing.timingType === "static") {
    defaultSecondsList = defaultSecondsList.concat([
      staticImageTimes.filter((info) => info.value === timing.staticTime)[0].seconds,
    ]);
  } else {
    defaultSecondsList = defaultSecondsList.concat(
      classLengths.filter((info) => info.value === timing.classLength)[0].intervals,
    );
  }
  const { secondsRemaining } = useTimer(defaultSecondsList, timerRunning, (atEndOfTime) => {
    console.log("is:", atEndOfTime, timing.timingType);
    if (atEndOfTime && timing.timingType === "class") {
      if (stopButtonRef.current) {
        stopButtonRef.current.click();
      }
    } else {
      if (nextButtonRef.current) {
        nextButtonRef.current.click();
      }
    }
  });

  // session API info
  const category = searchBarParams.get("category") || "";
  const tags = JSON.parse(searchBarParams.get("tags") || "{}");
  const source = searchBarParams.get("source") || undefined;

  const {
    data: session,
    isLoading,
    refetch,
  } = useGetSessionQuery({
    category,
    tags,
    source: source ? parseInt(source, 10) : undefined,
  });
  useEffect(() => {
    // grab brand new set of images when loading into a fresh session
    refetch();
  }, []);

  // get current image path from session, or from history
  const currentImageData = (onApiImages && session ? session[currentImage] : historyImages[currentImage]) || {
    id: 0,
    path: "",
  };
  const currentImageUrl = currentImageData.id
    ? `${import.meta.env.VITE_DRAWREF_IMAGE || "http://localhost:3300/image/"}${currentImageData.id}?max=${imageSize}`
    : "";

  // pan-and-zoom the reference image with mouse-wheel or pinch gestures.
  // resetting on image id means each new reference starts at the default zoom.
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const { transform, zoomed, consumeSuppressedClick } = useImageZoom(zoomContainerRef, currentImageData.id);

  return (
    <>
      {isLoading && <TheLoadingModal />}
      <div className="App z-0 bg-primary-950 text-white">
        <div
          ref={zoomContainerRef}
          className="absolute left-0 top-0 z-10 h-screen w-screen touch-none overflow-hidden"
          onClick={() => {
            // dragging or pinching the image shouldn't toggle the UI elements
            if (consumeSuppressedClick()) {
              return;
            }
            setShowUi(!showUi);
          }}
        >
          {currentImageUrl && (
            <img
              src={currentImageUrl}
              alt=""
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                cursor: zoomed ? "grab" : "default",
              }}
            />
          )}
        </div>
        <SessionTimer seconds={secondsRemaining} />
        <div className="absolute bottom-0 left-0 z-40 flex w-screen flex-col items-center">
          {currentImageData && currentImageData.effective_author && (
            <div className="w-auto min-w-[8rem] rounded-t-lg bg-slate-900 bg-opacity-55 text-center text-white">
              {currentImageData.effective_author_url && (
                <a href={currentImageData.effective_author_url} target="_blank" rel="noreferrer" className="px-3 pt-2">
                  {currentImageData.effective_author}
                </a>
              )}
              {!currentImageData.effective_author_url && (
                <span className="px-3 pt-2">{currentImageData.effective_author}</span>
              )}
            </div>
          )}
          {showUi && (
            <div className="flex min-h-8 min-w-20 justify-center rounded-t-3xl bg-primary-900 bg-opacity-95 px-2">
              <button
                type="button"
                className="py-2 pl-4 pr-1.5"
                onClick={() => {
                  if (!session) {
                    return;
                  }

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
              <button
                type="button"
                className="px-1.5 py-2"
                onClick={() => navigate(`/c/${category}`)}
                ref={stopButtonRef}
              >
                <Icon path={mdiStop} title="Stop session" size={1.2} className="text-white" />
              </button>
              {/* Note, need to re-architect the timer to implement this. have parent own the data, component take seconds and blindly render it */}
              <button type="button" className="px-1.5 py-2" onClick={() => setTimerRunning(!timerRunning)}>
                {timerRunning && <Icon path={mdiPause} title="Pause session" size={1.2} className="text-white" />}
                {!timerRunning && <Icon path={mdiPlay} title="Resume session" size={1.2} className="text-white" />}
              </button>
              <button
                type="button"
                className="py-2 pl-1.5 pr-3"
                ref={nextButtonRef}
                onClick={() => {
                  if (onApiImages && session && currentImage === session.length - 1) {
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
              {/* <button type="button" className="py-2.5 pl-3 pr-4">
                <Icon path={mdiHeart} title="Favourite" size={1} className="text-favouriteActive" />
              </button> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Session;
