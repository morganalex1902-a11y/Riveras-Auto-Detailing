import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, LayoutDashboard, ArrowRight } from "lucide-react";

export default function Index() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 overflow-hidden pt-20">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
        </div>

        {/* Content */}
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Logo/Title */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                Rivera's Auto Detailing
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 font-semibold">
                Dealership Partner Portal
              </p>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl mx-auto">
              Submit detailing requests, track status, and manage your vehicle reconditioning needs
              with ease.
            </p>

            {/* CTA Buttons */}
            {!isLoggedIn ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Button
                  onClick={() => navigate("/login")}
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-gray-100 text-lg font-semibold px-8 py-6"
                >
                  Login to Continue
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-blue-100 text-sm mt-6">
                  Don't have access? Contact your account manager.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  onClick={() => navigate("/request")}
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-gray-100 font-semibold px-8 py-6 flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  New Request
                </Button>
                <Button
                  onClick={() => navigate("/dashboard")}
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 font-semibold px-8 py-6 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section (only if logged in) */}
      {isLoggedIn && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Quick Links</h2>
              <p className="text-gray-600 text-lg">Access your portal features</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* New Request Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  className="p-8 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate("/request")}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-900 text-white p-3 rounded-lg">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Submit New Request</h3>
                      <p className="text-gray-600 mb-4">
                        Create a new detailing service request for your vehicles. Select service
                        type, vehicle details, and special instructions.
                      </p>
                      <Button variant="link" className="text-blue-900 p-0 h-auto">
                        Create Request <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Dashboard Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card
                  className="p-8 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-900 text-white p-3 rounded-lg">
                      <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        View Dashboard
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Track all your service requests, view status, pricing, and other important
                        details in one place.
                      </p>
                      <Button variant="link" className="text-blue-900 p-0 h-auto">
                        Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About This Portal
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Rivera's Auto Detailing is a licensed and certified dealership detailing service
              provider serving the DMV area. This portal allows authorized dealership partners to
              seamlessly submit and track vehicle detailing requests.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700">
                <span className="font-semibold text-blue-900">For support:</span> Contact your
                account manager or call 323-994-8612
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
