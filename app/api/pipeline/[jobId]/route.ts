import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(
    req: Request,
    { params }: { params: { jobId: string } }
) {
    const { jobId } = params;

    const { data: job, error } = await supabase
        .from("jobs")
        .select("id, title, workflow")
        .eq("id", jobId)
        .single();

    // ✅ IMPORTANT NULL CHECK
    if (error || !job) {
        return NextResponse.json(
            { error: "Job not found" },
            { status: 404 }
        );
    }

    // safe to use job now
    return NextResponse.json({
        id: job.id,
        title: job.title,
        workflow: job.workflow,
    });
}
