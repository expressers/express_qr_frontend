import React, { useEffect } from "react";
import { Toaster, FormGeneratorQrc } from "@/components";

import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { useLoadingPage } from "@/hooks";

function Home() {
  const { setIsVisible } = useLoadingPage();

  useEffect(() => {
    setIsVisible(true);
  }, [setIsVisible]);

  return (
    <React.Fragment>
      <Toaster richColors />

      <>
        <div className="h-full w-full flex items-center justify-center flex-col gap-4 p-4 relative ">
          <div className="absolute inset-0 -z-10 ">
            <ShaderGradientCanvas>
              <ShaderGradient
                color1="#0000"
                control="query"
                urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=1&color1=%2300d425&color2=%23%2300000080&color3=%2300d425&destination=onCanvas&embedMode=off&envPreset=lobby&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=env&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&range=enabled&rangeEnd=38.6&rangeStart=0&reflection=0.5&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.3&uFrequency=5.5&uSpeed=0.4&uStrength=4&uTime=0&wireframe=false"
              />
            </ShaderGradientCanvas>
          </div>
        </div>
        <div className="absolute sm:bottom-10 bottom-2 flex items-center justify-center w-full  px-4 ">
          <FormGeneratorQrc />
        </div>
      </>
    </React.Fragment>
  );
}

export { Home };
