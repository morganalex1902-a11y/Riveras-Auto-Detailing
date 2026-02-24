import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password || !name) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            name,
            dealership_id: "a0420293-d4a1-4162-a570-40edb7e031ba", // Test dealership
            role: "sales_rep",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      toast({
        title: "Account Created",
        description: "Your account has been created successfully. Please log in.",
      });

      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Signup failed. Please try again.");
      console.error(err);
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
              Create Account
            </h1>
            <p className="text-muted-foreground text-sm uppercase tracking-wider">
              Rivera's Auto Detailing
            </p>
            <div className="w-16 h-[2px] bg-primary mx-auto mt-6" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            <div>
              <label htmlFor="name" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="text-center border-t border-border/30 pt-6">
            <p className="text-muted-foreground text-xs mb-3">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primary/80 font-display uppercase tracking-wider transition-colors"
              >
                Login
              </button>
            </p>
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
