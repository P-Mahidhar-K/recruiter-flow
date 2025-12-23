"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import "../login/auth.css";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSignup(e: any) {
        e.preventDefault();

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            router.push("/login");
        }
    }

    return (
        <div className="auth-wrapper">
            <form className="auth-card" onSubmit={handleSignup}>
                <h2>Create RecruitFlow Account</h2>

                <input
                    type="email"
                    placeholder="Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="error">{error}</p>}

                <button>Create Account</button>

                <p className="switch">
                    Already have an account?{" "}
                    <span onClick={() => router.push("/login")}>Login</span>
                </p>
            </form>
        </div>
    );
}
