import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
    const { applicationId, stageIndex, status } = await req.json();

    // FAILED → reject application
    if (status === "FAILED") {
        await supabase
            .from("applications")
            .update({
                status: "REJECTED",
                failed_stage_index: stageIndex,
            })
            .eq("id", applicationId);

        return NextResponse.json({ success: true });
    }

    // PASSED → move to next stage
    if (status === "PASSED") {
        await supabase
            .from("applications")
            .update({
                current_stage_index: stageIndex + 1,
            })
            .eq("id", applicationId);

        return NextResponse.json({ success: true });
    }

    // OFFER
    if (status === "HIRED" || status === "REJECTED") {
        await supabase
            .from("applications")
            .update({
                status,
            })
            .eq("id", applicationId);

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
}
