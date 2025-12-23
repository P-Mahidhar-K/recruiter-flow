"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function JobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);

    useEffect(() => {
        supabase.from("jobs").select("*").then(({ data }) => {
            setJobs(data || []);
        });
    }, []);

    return (
        <div>
            <h1>Jobs</h1>
            {jobs.map(job => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                    <div>{job.title}</div>
                </Link>
            ))}
        </div>
    );
}
