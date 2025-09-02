import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
}

export default AnalyticsTracker;
