import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import PageLoader from "@/components/PageLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import ServiceArea from "./pages/ServiceArea";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Helmet>
            <title>Rivera's Auto Detailing | Professional Detailing in Maryland</title>
            <meta name="description" content="Professional auto detailing services in Maryland. Dealer-focused showroom preparation, N/C & U/C delivery, tint removal, and lot wash services. Call 323-994-8612." />
            <script type="application/ld+json">{JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Rivera's Auto Detailing",
              "areaServed": ["Washington DC", "Maryland", "Virginia"],
              "telephone": "323-994-8612",
              "email": "eliasrivera1884@gmail.com",
              "serviceOffered": ["N/C Delivery", "U/C Delivery", "U/C Detail", "Tint Removal", "Showroom Car Preparation", "Complementary Lot Wash"]
            })}</script>
          </Helmet>
          <ScrollToTop />
          <PageLoader>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/service-area" element={<ServiceArea />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </PageLoader>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
