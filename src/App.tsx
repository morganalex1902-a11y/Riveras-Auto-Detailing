import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import PageLoader from "@/components/PageLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import ServiceArea from "./pages/ServiceArea";
import Trusted from "./pages/Trusted";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Request from "./pages/Request";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoggedIn } = useAuth();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Helmet>
              <title>
                Rivera's Auto Detailing | Dealership Detailing & Vehicle Reconditioning | Maryland
              </title>
              <meta
                name="description"
                content="Premium dealership auto detailing in Maryland. Professional N/C & U/C delivery, showroom preparation, vehicle reconditioning & lot wash. Licensed & certified. Serving DMV area."
              />
              <meta
                name="keywords"
                content="dealership detailing, auto detailing Maryland, vehicle reconditioning, showroom preparation, N/C delivery, U/C delivery, lot wash, DMV auto services"
              />
              <meta name="robots" content="index, follow" />
              <link rel="canonical" href="https://riverasautodetailing.com/" />

              {/* Local Business Schema */}
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "LocalBusiness",
                  "@id": "https://riverasautodetailing.com",
                  name: "Rivera's Auto Detailing, LLC",
                  image:
                    "https://cdn.builder.io/api/v1/image/assets%2F0f00b454c21444a59a62cb373d89a358%2F7322560b6f384e6b960289838005c4ee?format=webp",
                  description: "Professional dealership auto detailing and vehicle reconditioning services in Maryland",
                  address: {
                    "@type": "PostalAddress",
                    addressRegion: "MD",
                    addressCountry: "US",
                  },
                  areaServed: [
                    {
                      "@type": "City",
                      name: "Washington",
                      state: "DC",
                    },
                    {
                      "@type": "State",
                      name: "Maryland",
                    },
                    {
                      "@type": "State",
                      name: "Virginia",
                    },
                  ],
                  telephone: "323-994-8612",
                  email: "eliasrivera1884@gmail.com",
                  priceRange: "$$",
                  service: [
                    {
                      "@type": "Service",
                      name: "N/C Delivery",
                      description:
                        "Professional prep before delivery. Full interior and exterior presentation to dealership-ready standards.",
                    },
                    {
                      "@type": "Service",
                      name: "U/C Delivery",
                      description:
                        "Professional prep before delivery. Full interior and exterior presentation to dealership-ready standards.",
                    },
                    {
                      "@type": "Service",
                      name: "U/C Detail",
                      description:
                        "Reconditioning pre-owned vehicles to their best possible condition. Improving appearance, value, and buyer appeal.",
                    },
                    {
                      "@type": "Service",
                      name: "Showroom Preparation",
                      description: "High-level presentation detailing for showroom",
                    },
                    {
                      "@type": "Service",
                      name: "Tint Removal",
                      description: "Professional window tint removal",
                    },
                    {
                      "@type": "Service",
                      name: "Lot Wash",
                      description: "Routine dealership maintenance wash",
                    },
                  ],
                  url: "https://riverasautodetailing.com",
                })}
              </script>

              {/* Organization Schema */}
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "Rivera's Auto Detailing",
                  url: "https://riverasautodetailing.com",
                  logo: "https://cdn.builder.io/api/v1/image/assets%2F0f00b454c21444a59a62cb373d89a358%2F7322560b6f384e6b960289838005c4ee?format=webp",
                  description: "Licensed and certified dealership auto detailing services",
                  sameAs: [],
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "Business Support",
                    telephone: "323-994-8612",
                    email: "eliasrivera1884@gmail.com",
                  },
                })}
              </script>
            </Helmet>
            <ScrollToTop />
            <PageLoader>
              <Navbar />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/service-area" element={<ServiceArea />} />
                <Route path="/trusted" element={<Trusted />} />

                {/* Auth routes */}
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route
                  path="/request"
                  element={<ProtectedRoute element={<Request />} />}
                />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<Dashboard />} adminOnly={false} />}
                />

                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              {!isLoggedIn && <Footer />}
            </PageLoader>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
