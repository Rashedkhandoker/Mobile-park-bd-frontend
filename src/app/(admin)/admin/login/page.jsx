"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/adminAuthContext";
import { RiLockLine, RiMailLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    router.replace("/admin");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #1a202c 100%)",
      padding: 16,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        borderRadius: 16,
        padding: "40px 36px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16,
          }}>
            <RiLockLine size={28} color="#fff" />
          </div>
          <h4 style={{ margin: 0, fontWeight: 700, color: "#1a202c", fontSize: "1.4rem" }}>
            Admin Login
          </h4>
          <p style={{ margin: "8px 0 0", color: "#718096", fontSize: "0.9rem" }}>
            Sign in to management console
          </p>
        </div>

        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: 8, marginBottom: 20,
            background: "#fed7d7", color: "#c53030", fontSize: "0.85rem",
            border: "1px solid #feb2b2",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 500, color: "#4a5568" }}>
              Email
            </label>
            <div style={{ position: "relative" }}>
              <RiMailLine style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#a0aec0" }} size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                style={{
                  width: "100%", height: 44, paddingLeft: 40, paddingRight: 14,
                  border: "1px solid #e2e8f0", borderRadius: 10, fontSize: "0.9rem",
                  outline: "none", color: "#1a202c", background: "#f7fafc",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 500, color: "#4a5568" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <RiLockLine style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#a0aec0" }} size={18} />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: "100%", height: 44, paddingLeft: 40, paddingRight: 44,
                  border: "1px solid #e2e8f0", borderRadius: 10, fontSize: "0.9rem",
                  outline: "none", color: "#1a202c", background: "#f7fafc",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#a0aec0", padding: 0,
                }}
              >
                {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", height: 46, border: "none", borderRadius: 10,
              background: loading ? "#a5b4fc" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontWeight: 600, fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
