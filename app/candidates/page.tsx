"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<any[]>([]);

    useEffect(() => {
        supabase.from("candidates").select("*")
            .then(({ data }) => setCandidates(data || []));
    }, []);

    return (
        <div>
            <h1>Candidates</h1>
            {candidates.map(c => (
                <div key={c.id}>{c.name}</div>
            ))}
        </div>
    );
}
