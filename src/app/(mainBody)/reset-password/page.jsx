"use client";
import { verifyResetToken, resetCustomerPassword } from "@/utils/backendApi/customerAuthApi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying"); // verifying | invalid | ready | done
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    verifyResetToken(token)
      .then((body) => setStatus(body?.success ? "ready" : "invalid"))
      .catch(() => setStatus("invalid"));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      const body = await resetCustomerPassword(token, newPassword, confirmPassword);
      if (body?.success) {
        setStatus("done");
        setTimeout(() => router.push("/auth/login"), 2500);
      } else {
        setError(body?.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="login-page section-t-space section-b-space">
      <Container>
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <h3 className="mb-3">Reset Password</h3>
            <div className="theme-card" style={{ padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
              {status === "verifying" && <p>Verifying reset link...</p>}

              {status === "invalid" && (
                <>
                  <div role="alert" className="alert alert-danger">
                    This password reset link is invalid or has expired.
                  </div>
                  <p>
                    Request a new one from the{" "}
                    <Link href="/auth/login">login page</Link> using “Forgot your password?”.
                  </p>
                </>
              )}

              {status === "ready" && (
                <form className="theme-form" onSubmit={handleSubmit}>
                  {error && (
                    <div role="alert" className="alert alert-danger">
                      {error}
                    </div>
                  )}
                  <div className="form-group mb-3">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      id="newPassword"
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-solid" disabled={submitting}>
                    {submitting ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}

              {status === "done" && (
                <div role="alert" className="alert alert-success">
                  Password reset successfully. Redirecting to login...
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}
