import React from "react";
import { Outlet, Link, useLocation } from "react-router";
import { Menu, X, Sun, Moon, LogIn, LogOut, User as UserIcon, Shield } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact Us" },
    { path: "/privacy", label: "Privacy Policy" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span
                className="text-primary font-bold text-lg uppercase tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.2em" }}
              >
                GymLog
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    "px-3 py-2 rounded-sm text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={clsx(
                    "px-3 py-2 rounded-sm text-sm font-medium transition-colors",
                    location.pathname.startsWith("/dashboard")
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={clsx(
                    "px-3 py-2 rounded-sm text-sm font-medium transition-colors",
                    location.pathname.startsWith("/admin")
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}
                >
                  <span className="flex items-center gap-1"><Shield size={14} /> Admin</span>
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <UserIcon size={14} />
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{user?.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}
                >
                  <LogIn size={14} />
                  Login
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "px-3 py-2 rounded-sm text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="px-3 py-2 rounded-sm text-sm font-medium text-left text-destructive hover:bg-destructive/10 transition-colors"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-sm text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Login / Signup
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span
                className="text-primary font-bold text-sm uppercase tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.2em" }}
              >
                GymLog
              </span>
              <p className="mt-2 text-sm text-muted-foreground">
                Track your progressive overload and achieve your fitness goals.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Links
              </h4>
              <div className="flex flex-col gap-1">
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Account
              </h4>
              <div className="flex flex-col gap-1">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                    <Link to="/dashboard/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
                    <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground font-mono">
              © 2026 GymLog. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
