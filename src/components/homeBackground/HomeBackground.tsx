import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { useIsDark } from "./useIsDark";

// Black and white only: greys between #4A4A4A and #EDEDED (see design-direction 4.2).
const PALETTE = {
  dark: {
    bgColor: "#0b0b0b",
    color1: "#ededed",
    color2: "#4a4a4a",
    color3: "#0b0b0b",
    brightness: 0.9,
    reflection: 0.25,
  },
  light: {
    bgColor: "#f6f6f6",
    color1: "#ffffff",
    color2: "#a0a0a0",
    color3: "#dcdcdc",
    brightness: 1,
    reflection: 0.2,
  },
} as const;

/**
 * The only module that imports three / @react-three/fiber / @shadergradient.
 * It is loaded through React.lazy from HomeBackdrop, never from a barrel.
 */
export default function HomeBackground() {
  const isDark = useIsDark();
  const p = isDark ? PALETTE.dark : PALETTE.light;

  return (
    <div className="backdrop-webgl" key={isDark ? "dark" : "light"}>
      <ShaderGradientCanvas
        pixelDensity={1}
        fov={45}
        pointerEvents="none"
        style={{ position: "absolute", inset: 0 }}>
        <ShaderGradient
          control="props"
          type="waterPlane"
          animate="on"
          uTime={0}
          uSpeed={0.25}
          uStrength={3}
          uDensity={1.3}
          uFrequency={5.5}
          uAmplitude={0}
          color1={p.color1}
          color2={p.color2}
          color3={p.color3}
          brightness={p.brightness}
          reflection={p.reflection}
          lightType="env"
          envPreset="city"
          grain="off"
          cAzimuthAngle={180}
          cPolarAngle={90}
          cDistance={3.6}
          cameraZoom={1}
          positionX={-1.4}
          positionY={0}
          positionZ={0}
          rotationX={0}
          rotationY={10}
          rotationZ={50}
          range="enabled"
          rangeStart={0}
          rangeEnd={38.6}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
