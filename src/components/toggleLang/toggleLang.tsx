import { useLang } from "@/hooks";
import { vectorImages } from "@/assets";
import React from "react";
import { Button } from "../ui";

function ToggleLang() {
  const { valueLang, setValueLang } = useLang();
  const isLang = valueLang === "en" ? "pt" : "en";
  return (
    <React.Fragment>
      <Button
        variant="outline"
        size="icon"
        className="relative md:p-6 p-4"
        onClick={() => setValueLang(isLang)}>
        <img
          src={vectorImages.flags.GB_flag}
          className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
            valueLang === "en" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          }`}
          alt="English flag"
        />
        <img
          src={vectorImages.flags.Pt_flag}
          className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
            valueLang === "pt" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          }`}
          alt="Portuguese flag"
        />
      </Button>
    </React.Fragment>
  );
}

export { ToggleLang };
