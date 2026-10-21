import { Button } from "@/components";
import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <React.Fragment>
      <div className="h-screen flex items-center justify-center gap-4">
        <h3 className="text-9xl font-bold">404 </h3>
        <div className="space-y-3">
                  <p>Pagina não encontrada</p>
                  <Button className=" " variant="default">
                      <Link to="/">Retorna</Link>
                  </Button>
        </div>
      </div>
    </React.Fragment>
  );
}

export { NotFound };
