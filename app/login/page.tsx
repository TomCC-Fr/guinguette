"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("Identifiants incorrects");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md space-y-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold text-center">
          Connexion Administrateur
        </h1>

        <div>
          <label className="block text-sm text-stone-500 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            className="border w-full p-2 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-stone-500 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            required
            className="border w-full p-2 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="bg-stone-800 text-white w-full py-2 rounded-lg hover:bg-stone-700 transition disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
