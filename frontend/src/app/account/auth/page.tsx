"use client";

import Login from "@/components/login"
import Register from "@/components/register"
import {useState} from "react";

export default function Auth() {
  const [showLogin, setShowLogin] = useState(true);

  const toggleComponent = () => {
    setShowLogin(!showLogin);
  };

  return (
    <main className="flex min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
      { showLogin ? <Login toggleComponent={toggleComponent} /> : <Register toggleComponent={toggleComponent}/> }
    </main>
  )
}
