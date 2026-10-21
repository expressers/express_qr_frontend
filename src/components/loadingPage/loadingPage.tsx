import { useLoadingPage } from "@/hooks";
import { useEffect, useState } from "react";

function LoadingPage() {
  const { visibleLoadingPage, setVisibleLoadingPage, isVisible } = useLoadingPage();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setVisibleLoadingPage(true);

      const timeoutFade = setTimeout(() => setFadeOut(true), 5000);
      const timeoutHide = setTimeout(() => setVisibleLoadingPage(false), 5000);

      return () => {
        clearTimeout(timeoutFade);
        clearTimeout(timeoutHide);
      };
    }
  }, [isVisible,setVisibleLoadingPage]);

  return (
    visibleLoadingPage && (
      <div
        className={`absolute h-full w-full z-[100] top-0 left-0 right-0 dark:bg-black bg-white flex items-center justify-center transition-opacity duration-700 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}>
        <span
          data-text="BISC"
          className="relative sm:text-6xl text-4xl font-bold tracking-[.4rem]
            [-webkit-text-fill-color:transparent] [-webkit-text-stroke-width:1px]
            dark:text-white text-black before:content-[attr(data-text)] before:absolute before:top-0 before:left-0
            before:overflow-hidden before:[width:0] before:dark:text-white before:text-black
            before:[-webkit-text-stroke-width:0px] dark:before:[-webkit-text-fill-color:white]
            before:[-webkit-text-fill-color:black] before-animate-fillText">
          BISC
          <span
            data-text="8QR"
            className="relative text-green-600
              before:content-[attr(data-text)] before:absolute
              before:overflow-hidden before:[width:0] before:text-green-600
              before:[-webkit-text-stroke-width:0px]
              before-text-fill-green before-animate-fillText-qr">
            8QR
          </span>
        </span>
      </div>
    )
  );
}

export { LoadingPage };
