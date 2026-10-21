import React  from "react";

import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

function CreateQrcode() {
  

  return (
    <React.Fragment>
      <Link
        className="bg-card px-6 py-4 flex justify-center items-center border rounded-xl"
        to="/dashboard/qrcode-generator">
        <span>
          <Plus size={30} />
        </span>
      </Link>
    </React.Fragment>
  );
}

export { CreateQrcode };
