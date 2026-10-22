import React, { useEffect } from "react";
import { FormGeneratorQrc } from "@/components";
import { HomeBackdrop } from "@/components/homeBackground";
import { useLoadingPage } from "@/hooks";

function Home() {
  const { setIsVisible } = useLoadingPage();

  useEffect(() => {
    setIsVisible(true);
  }, [setIsVisible]);

  return (
    <React.Fragment>

      <div className="relative isolate h-full w-full overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <HomeBackdrop />
        </div>
        <div className="absolute bottom-2 flex w-full items-center justify-center px-4 pb-[env(safe-area-inset-bottom)] sm:bottom-10">
          <FormGeneratorQrc />
        </div>
      </div>
    </React.Fragment>
  );
}

export { Home };
