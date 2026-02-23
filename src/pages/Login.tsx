import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        description: "Welcome to the dealership portal!",
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    try {
      await login(demoEmail, "demo");
      toast({
        title: "Demo Login Successful",
        description: `Logged in as ${demoEmail}`,
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Rivera's Auto Detailing
            </h1>
            <p className="text-gray-600">Dealership Partner Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="border-gray-300"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="border-gray-300"
              />
            </div>

            {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 h-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Demo Login */}
          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 text-center mb-4">Demo accounts:</p>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => handleDemoLogin("robert@salesdealership.com")}
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                Sales Rep Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => handleDemoLogin("manager@dealership.com")}
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                Admin Demo
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <button className="text-blue-900 hover:text-blue-800 text-sm font-medium">
              Forgot password?
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
