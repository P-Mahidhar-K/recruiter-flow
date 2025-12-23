"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    async function logout() {
        await supabase.auth.signOut();
        router.push("/login");
    }

    return (
        <div style={styles.navbar}>
            <h2 style={styles.logo}>RecruitFlow</h2>
            <button onClick={logout} style={styles.logout}>
                Logout
            </button>
        </div>
    );
}

const styles = {
    navbar: {
        height: "60px",
        background: "#1e3c72",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
    },
    logo: {
        margin: 0,
    },
    logout: {
        background: "white",
        color: "#1e3c72",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};
