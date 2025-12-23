import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
    try {
        const { applicationId, stageIndex, status } = await req.json();

        if (!applicationId) {
            return NextResponse.json(
                { error: "Missing applicationId" },
                { status: 400 }
            );
        }

        /* ================= FETCH APPLICATION ================= */
        const { data: app, error: fetchError } = await supabase
            .from("applications")
            .select("id, current_stage_index, status, history")
            .eq("id", applicationId)
            .single();

        if (fetchError || !app) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        let newStageIndex = app.current_stage_index;
        let newAppStatus = app.status ?? "IN_PROGRESS";

        /* ================= STAGE LOGIC ================= */

        // FAILED at any stage → REJECTED
        if (status === "FAILED") {
            newAppStatus = "REJECTED";
        }

        // PASSED → move to next stage
        else if (status === "PASSED") {
            newStageIndex = stageIndex + 1;
        }

        // OFFER STAGE
        if (status === "HIRED") {
            newAppStatus = "HIRED";
        }

        if (status === "REJECTED") {
            newAppStatus = "REJECTED";
        }

        /* ================= UPDATE HISTORY ================= */
        const updatedHistory = [
            ...(app.history || []),
            {
                stage_index: stageIndex,
                status,
                date: new Date().toISOString(),
            },
        ];

        /* ================= UPDATE APPLICATION ================= */
        const { error: updateError } = await supabase
            .from("applications")
            .update({
                current_stage_index: newStageIndex,
                status: newAppStatus,
                history: updatedHistory,
            })
            .eq("id", applicationId);

        if (updateError) {
            return NextResponse.json(
                { error: updateError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Unexpected error" },
            { status: 500 }
        );
    }
}
