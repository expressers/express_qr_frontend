import React, { useEffect } from 'react'
import { useNavigate} from 'react-router-dom'
function About() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/construction", { replace: true });
  }, [navigate]);

  return (
    <React.Fragment>About</React.Fragment>
  )
}

export {About}