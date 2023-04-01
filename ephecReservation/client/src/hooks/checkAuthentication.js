import { useEffect } from "react";
import { useHistory } from "react-router-dom";

function useAuthentication() {
  const history = useHistory();
  let isRedirected = false;

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        window.location.href !== "http://localhost:8800/home" &&
        localStorage.length === 0 &&
        !isRedirected
      ) {
        history.push("/home");
        document.getElementById("tabBar").style.display="none";
        isRedirected = true;
      } else if (window.location.href === "http://localhost:8800/home") {
        isRedirected = false;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [history]);

  return;
}

export default useAuthentication;
