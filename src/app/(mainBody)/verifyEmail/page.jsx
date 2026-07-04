"use client";
import { verifyCustomerEmail } from "@/utils/backendApi/customerAuthApi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "reactstrap";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying"); // verifying | done | invalid
  // Verification consumes the token server-side. React StrictMode runs effects
  // twice in dev — the second POST would 400 and wrongly show "invalid".
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    if (!token) {
      setStatus("invalid");
      return;
    }
    verifyCustomerEmail(token)
      .then((body) => setStatus(body?.success ? "done" : "invalid"))
      .catch(() => setStatus("invalid"));
  }, [token]);

  return (
    <section className="login-page section-t-space section-b-space">
      <Container>
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <h3 className="mb-3">Email Verification</h3>
            <div className="theme-card" style={{ padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
              {status === "verifying" && <p>Verifying your email...</p>}
              {status === "done" && (
                <>
                  <div role="alert" className="alert alert-success">
                    Email verified successfully. You can now sign in.
                  </div>
                  <Link href="/auth/login" className="btn btn-solid">
                    Go to Login
                  </Link>
                </>
              )}
              {status === "invalid" && (
                <div role="alert" className="alert alert-danger">
                  This verification link is invalid or has expired.
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}
