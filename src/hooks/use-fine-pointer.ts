import { useEffect, useState } from "react";

// True only on mouse/trackpad devices. Defaults to false so the server render
// and every touch device get the static board — drag never fights scrolling.
export const useIsFinePointer = () => {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return fine;
};
