"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/request-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        setIsOtpSent(true);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      otp,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/pages/dashboard"); // Redirect on success
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6  shadow-lg rounded-lg w-96 bg-[#323232]">
        <h2 className="text-2xl font-semibold text-center">Sign In</h2>

        {!isOtpSent ? (
          <form onSubmit={handleRequestOtp} className="mt-4">
            <label className="block text-sm font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded text-black"
            />
            <button
              type="submit"
              className="w-full mt-3 bg-[#242424] text-white p-2 rounded"
            >
              Get OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="mt-4">
            <label className="block text-sm font-medium">Enter OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-2 mt-1 border rounded text-black"
            />
            <button
              type="submit"
              className="w-full mt-3 bg-green-500 text-black p-2 rounded"
            >
              Sign In
            </button>
          </form>
        )}

        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
