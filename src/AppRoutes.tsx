import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { useHashScroll } from "@/hooks/use-hash-scroll";
import Index from "./pages/Index";
import About from "./pages/About";
import BigLongLake from "./pages/BigLongLake";
import LakeHistory from "./pages/LakeHistory";
import NorthernIndianaLakes from "./pages/NorthernIndianaLakes";
import NorthernIndianaIceCream from "./pages/NorthernIndianaIceCream";
import Welcome from "./pages/Welcome";
import BookingConfirmed from "./pages/BookingConfirmed";
import NotFound from "./pages/NotFound";

// Router-agnostic app tree. The router itself is supplied by the caller:
// - BrowserRouter on the client (App.tsx)
// - StaticRouter during static prerendering (entry-server.tsx)
const AppRoutes = () => {
  // Restores the anchor jump that hydration would otherwise discard, so
  // /#inquire from another page actually lands on the enquiry form.
  useHashScroll();

  return (
    <TooltipProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/big-long-lake" element={<BigLongLake />} />
        <Route path="/history-of-big-long-lake" element={<LakeHistory />} />
        <Route path="/northern-indiana-lakes" element={<NorthernIndianaLakes />} />
        <Route path="/northern-indiana-ice-cream" element={<NorthernIndianaIceCream />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
};

export default AppRoutes;
