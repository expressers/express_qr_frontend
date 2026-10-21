import React from "react";
import { vectorImages } from "@/assets";
import { Button } from "@/components";
import { Link } from "react-router-dom";
function Construction() {
  return (
    <React.Fragment>
      <div className="h-screen w-full flex flex-col gap-3 items-center justify-center ">
        <div className="md:w-1/3 sm:w-1/2 w-3/4">
          <img
            src={vectorImages.personQr.PersonConstruction}
            className="w-full"
            alt="constrution"
          />
        </div>
        <Button asChild className="p-6">
          <Link to="/">Voltar</Link>
        </Button>
      </div>
    </React.Fragment>
  );
}

export { Construction };
