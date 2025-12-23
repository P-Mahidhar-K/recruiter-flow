import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { jobId: string } }
) {
    const { jobId } = params;

    const { data: job } = await supabase
        .from("jobs")
        .select("id,title,workflow")
        .eq("id", jobId)
        .single();

    const { data: applications } = await supabase
        .from("applications")
        .select(`
      id,
      current_stage_index,
      candidates ( id, name, email )
    `)
        .eq("job_id", jobId);

    return NextResponse.json({
        job,
        applications
    });
}
