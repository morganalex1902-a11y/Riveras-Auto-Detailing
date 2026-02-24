import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [foundUser, setFoundUser] = useState<any>(null);
  const [securityAnswerInput, setSecurityAnswerInput] = useState("");
  const [securityAnswerVerified, setSecurityAnswerVerified] = useState(false);
  const [verifyingAnswer, setVerifyingAnswer] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
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

  const handleForgotPasswordSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);

    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", forgotEmail)
        .single();

      if (error || !user) {
        throw new Error("No account found with this email");
      }

      if (!user.security_question || !user.security_answer) {
        throw new Error("This account does not have a security question set up. Please contact your admin.");
      }

      setFoundUser(user);
      setSecurityAnswerVerified(false);
      setSecurityAnswerInput("");
    } catch (err: any) {
      setForgotError(err?.message || "Failed to find account. Please check your email.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifySecurityAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setVerifyingAnswer(true);

    try {
      const userAnswer = securityAnswerInput.toLowerCase().trim();
      const storedAnswer = foundUser.security_answer.toLowerCase().trim();

      if (userAnswer !== storedAnswer) {
        throw new Error("Incorrect security answer. Please try again.");
      }

      setSecurityAnswerVerified(true);
    } catch (err: any) {
      setForgotError(err?.message || "Failed to verify security answer.");
    } finally {
      setVerifyingAnswer(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!securityAnswerVerified) {
      setForgotError("Please verify your security answer first");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters");
      return;
    }

    setResettingPassword(true);

    try {
      // Hash the new password
      const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(newPassword));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Update the user's password
      const { error } = await supabase
        .from("users")
        .update({ password_hash: passwordHash })
        .eq("id", foundUser.id);

      if (error) throw error;

      toast({
        title: "Password Reset Successful",
        description: "You can now log in with your new password",
      });

      // Reset form
      setShowForgotPassword(false);
      setForgotEmail("");
      setFoundUser(null);
      setSecurityAnswerInput("");
      setSecurityAnswerVerified(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setForgotError(err?.message || "Failed to reset password. Please try again.");
    } finally {
      setResettingPassword(false);
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
          {(showForgotPassword || foundUser) && (
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setFoundUser(null);
                setForgotEmail("");
                setSecurityAnswerInput("");
                setSecurityAnswerVerified(false);
                setNewPassword("");
                setConfirmPassword("");
                setForgotError("");
              }}
              className="flex items-center gap-2 text-primary hover:text-primary/80 text-xs font-display uppercase tracking-wider mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-[2px] bg-primary mx-auto mb-6 gold-glow" />
            <h1 className="text-3xl md:text-4xl font-display uppercase tracking-wider mb-2">
              {foundUser ? "Set New Password" : showForgotPassword ? "Reset Password" : "Dealership Portal"}
            </h1>
            <p className="text-muted-foreground text-sm uppercase tracking-wider">
              {foundUser || showForgotPassword ? "Recover your account" : "Rivera's Auto Detailing"}
            </p>
            <div className="w-16 h-[2px] bg-primary mx-auto mt-6" />
          </div>

          {/* Login Form */}
          {!showForgotPassword && !foundUser && (
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
          )}

          {/* Forgot Password - Email Search Form */}
          {showForgotPassword && !foundUser && (
            <form onSubmit={handleForgotPasswordSearch} className="space-y-5 mb-8">
              <div>
                <label htmlFor="forgot-email" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Email Address
                </label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="your@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  disabled={forgotLoading}
                  className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              {forgotError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/20 border border-destructive/50 text-destructive p-3 rounded-sm text-sm"
                >
                  {forgotError}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={forgotLoading}
                className="w-full bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest py-2.5 h-auto text-sm"
              >
                {forgotLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Find Account"
                )}
              </Button>
            </form>
          )}

          {/* Security Question Verification Form */}
          {foundUser && !securityAnswerVerified && (
            <form onSubmit={handleVerifySecurityAnswer} className="space-y-5 mb-8">
              <div className="bg-background/50 p-3 rounded border border-border/30 mb-4">
                <p className="text-xs text-muted-foreground">
                  Account: <span className="font-semibold text-foreground">{foundUser.email}</span>
                </p>
              </div>

              <div>
                <label htmlFor="sec-question-display" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Security Question
                </label>
                <div className="bg-background/50 p-3 rounded border border-border/30">
                  <p className="text-sm text-foreground">{foundUser.security_question}</p>
                </div>
              </div>

              <div>
                <label htmlFor="sec-answer-input" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Your Answer <span className="text-destructive">*</span>
                </label>
                <Input
                  id="sec-answer-input"
                  type="text"
                  placeholder="Enter your answer"
                  value={securityAnswerInput}
                  onChange={(e) => setSecurityAnswerInput(e.target.value)}
                  required
                  disabled={verifyingAnswer}
                  className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              {forgotError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/20 border border-destructive/50 text-destructive p-3 rounded-sm text-sm"
                >
                  {forgotError}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={verifyingAnswer}
                className="w-full bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest py-2.5 h-auto text-sm"
              >
                {verifyingAnswer ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Answer"
                )}
              </Button>
            </form>
          )}

          {/* Reset Password Form */}
          {foundUser && securityAnswerVerified && (
            <form onSubmit={handleResetPassword} className="space-y-5 mb-8">
              <div className="bg-background/50 p-3 rounded border border-border/30 mb-4">
                <p className="text-xs text-muted-foreground">
                  Account: <span className="font-semibold text-foreground">{foundUser.email}</span>
                </p>
              </div>

              <div>
                <label htmlFor="new-password" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={resettingPassword}
                    className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={resettingPassword}
                    className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {forgotError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/20 border border-destructive/50 text-destructive p-3 rounded-sm text-sm"
                >
                  {forgotError}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={resettingPassword}
                className="w-full bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest py-2.5 h-auto text-sm"
              >
                {resettingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}

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
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-primary hover:text-primary/80 text-xs font-display uppercase tracking-wider transition-colors"
            >
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
