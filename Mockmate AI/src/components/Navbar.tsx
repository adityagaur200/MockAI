import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Menu, X, Key, Check, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const navLinks = [
  { label: "Features", to: "/#features" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Dashboard", to: "/dashboard" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));

    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setApiKeyInput(savedKey);
      setApiKeySaved(true);
    }

    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to: string) => location.pathname === to;

  const handleAuthButton = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      navigate("/");
      return;
    }
    navigate("/auth");
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem("gemini_api_key", apiKeyInput.trim());
      setApiKey(apiKeyInput.trim());
      setApiKeySaved(true);
      setApiKeyOpen(false);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
    setApiKeyInput("");
    setApiKeySaved(false);
  };

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 6)}${"•".repeat(8)}${apiKey.slice(-4)}`
    : "";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          <span className="font-semibold text-lg tracking-tight">Mockmate AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) =>
            l.to.startsWith("/#") ? (
              <a
                key={l.label}
                href={l.to}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                to={l.to}
                className={`text-sm transition-colors ${
                  isActive(l.to) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            )
          )}

          {/* API Key Popover */}
          <Popover open={apiKeyOpen} onOpenChange={setApiKeyOpen}>
            <PopoverTrigger asChild>
              <button
                className="relative flex items-center justify-center h-8 w-8 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                title={apiKeySaved ? "API Key configured" : "Set API Key"}
              >
                <Key className="h-4 w-4 text-muted-foreground" />
                {apiKeySaved && (
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 border-border/50 bg-card/95 backdrop-blur-xl shadow-lg"
              align="end"
              sideOffset={8}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold">Gemini API Key</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter your own Gemini API key to power the AI interview.
                  Your key is stored locally in your browser.
                </p>

                {apiKeySaved ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-xs font-mono text-emerald-400 truncate">
                        {maskedKey}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs"
                        onClick={() => setApiKeySaved(false)}
                      >
                        Change
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                        onClick={handleClearApiKey}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="AIzaSy..."
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="h-9 text-sm font-mono bg-background/50"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveApiKey();
                      }}
                    />
                    <Button
                      size="sm"
                      className="w-full h-8 text-xs bg-gradient-primary hover:shadow-glow transition-shadow"
                      onClick={handleSaveApiKey}
                      disabled={!apiKeyInput.trim()}
                    >
                      Save API Key
                    </Button>
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                  Get your API key from{" "}
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            size="sm"
            className="bg-gradient-primary hover:shadow-glow transition-shadow"
            onClick={handleAuthButton}
          >
            {isLoggedIn ? "Sign Out" : "Sign In"}
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b pb-4">
          <div className="container flex flex-col gap-3">
            {navLinks.map((l) =>
              l.to.startsWith("/#") ? (
                <a
                  key={l.label}
                  href={l.to}
                  className="text-sm text-muted-foreground py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-sm text-muted-foreground py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              )
            )}

            {/* Mobile API Key Section */}
            <div className="py-2 space-y-2">
              <div className="flex items-center gap-2">
                <Key className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm text-muted-foreground">API Key</span>
                {apiKeySaved && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </div>
              {apiKeySaved ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 truncate">
                    {maskedKey}
                  </span>
                  <button
                    className="text-xs text-destructive hover:underline"
                    onClick={handleClearApiKey}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Enter Gemini API key..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="h-8 text-xs font-mono flex-1"
                  />
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-gradient-primary"
                    onClick={handleSaveApiKey}
                    disabled={!apiKeyInput.trim()}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            <Button
              size="sm"
              className="bg-gradient-primary w-fit"
              onClick={handleAuthButton}
            >
              {isLoggedIn ? "Sign Out" : "Sign In"}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
