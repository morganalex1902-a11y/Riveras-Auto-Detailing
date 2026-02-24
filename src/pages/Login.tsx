import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
    } catch (err: any) {
      console.error("Login error:", err);

      let errorMessage = "Login failed. Please check your credentials and try again.";

      if (err?.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (err?.message?.includes("Database error")) {
        errorMessage = "Server error. Please try again in a moment.";
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-12">
      {/* Background gradient elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full filter blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Glass card container */}
        <div className="glass-card p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-[2px] bg-primary mx-auto mb-6 gold-glow" />
            <h1 className="text-3xl md:text-4xl font-display uppercase tracking-wider mb-2">
              Dealership Portal
            </h1>
            <p className="text-muted-foreground text-sm uppercase tracking-wider">
              Rivera's Auto Detailing
            </p>
            <div className="w-16 h-[2px] bg-primary mx-auto mt-6" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            <div>
              <label htmlFor="email" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
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
                className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
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
                className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/20 border border-destructive/50 text-destructive p-3 rounded-sm text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest py-2.5 h-auto text-sm"
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

          {/* Info Section */}
          <div className="border-t border-border/30 pt-6 mb-6">
            <p className="text-xs font-display uppercase tracking-wider text-muted-foreground text-center">
              Log in with your dealership account credentials
            </p>
          </div>

          {/* Footer Links */}
          <div className="text-center border-t border-border/30 pt-6">
            <p className="text-muted-foreground text-xs mb-3">
              Contact your dealership admin to create an account
            </p>
            <button className="text-primary hover:text-primary/80 text-xs font-display uppercase tracking-wider transition-colors">
              Forgot password?
            </button>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="mt-8 flex justify-center">
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
