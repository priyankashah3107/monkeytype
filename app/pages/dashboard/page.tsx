"use client";

import { signOut } from "next-auth/react";
import React from "react";

const Dashboard: React.FC = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/pages/signin" });
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
