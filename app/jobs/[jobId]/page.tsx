"use client";

import { useEffect, useState } from "react";

type StageStatus =
    | "PASSED"
    | "IN_PROGRESS"
    | "FAILED"
    | "NOT_STARTED"
    | "HIRED"
    | "REJECTED";

export default function JobPipeline({ params }: any) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    /* ================= LOAD PIPELINE ================= */
    useEffect(() => {
        fetch(`/api/jobs/${params.jobId}/pipeline`)
            .then(res => res.json())
            .then(res => {
                console.log("PIPELINE DATA 👉", res);
                setData(res);
                setLoading(false);
            });
    }, [params.jobId]);

    if (loading) return <div style={{ padding: 16 }}>Loading pipeline…</div>;
    if (!data) return <div>No data found</div>;

    const workflow: string[] = data.job.workflow;

    /* ================= STATUS RESOLVER ================= */
    function getStageStatus(app: any, stageIndex: number): StageStatus {
        const isOfferStage = stageIndex === workflow.length - 1;

        // OFFER STAGE
        if (isOfferStage) {
            if (app.status === "HIRED") return "HIRED";
            if (app.status === "REJECTED") return "REJECTED";
            return "NOT_STARTED";
        }

        if (stageIndex < app.current_stage_index) return "PASSED";
        if (stageIndex === app.current_stage_index) return "IN_PROGRESS";
        return "NOT_STARTED";
    }

    return (
        <div style={{ padding: 16 }}>
            {/* ================= HEADER ================= */}
            <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                {data.job.title} – Pipeline
            </h1>

            {/* ================= PIPELINE ================= */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `260px repeat(${workflow.length}, 180px)`,
                    gap: 10,
                    overflowX: "auto",
                }}
            >
                {/* ===== HEADER ROW ===== */}
                <div style={{ fontWeight: 600 }}>Candidate</div>
                {workflow.map(stage => (
                    <div key={stage} style={{ fontWeight: 600, textAlign: "center" }}>
                        {stage}
                    </div>
                ))}

                {/* ===== ROWS ===== */}
                {data.applications.map((app: any) => (
                    <>
                        {/* Candidate column */}
                        <div
                            key={app.id}
                            style={{
                                background: "#fff",
                                borderRadius: 10,
                                padding: 10,
                                fontSize: 12,
                            }}
                        >
                            <strong>{app.candidates.name}</strong>
                            <div style={{ fontSize: 11, color: "#6b7280" }}>
                                {app.candidates.email}
                            </div>

                            {/* Designation */}
                            {app.candidates.job_title && (
                                <div style={{ fontSize: 11, marginTop: 4 }}>
                                    {app.candidates.job_title}
                                </div>
                            )}

                            {/* Skills */}
                            {Array.isArray(app.candidates.skills) && (
                                <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                                    {app.candidates.skills.map((skill: string) => (
                                        <span
                                            key={skill}
                                            style={{
                                                fontSize: 10,
                                                padding: "2px 6px",
                                                borderRadius: 6,
                                                background: "#e5e7eb",
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stage columns */}
                        {workflow.map((_, index) => {
                            const status = getStageStatus(app, index);

                            return (
                                <div
                                    key={`${app.id}-${index}`}
                                    style={{
                                        background:
                                            status === "PASSED"
                                                ? "#dcfce7"
                                                : status === "IN_PROGRESS"
                                                    ? "#e0f2fe"
                                                    : status === "FAILED" || status === "REJECTED"
                                                        ? "#fee2e2"
                                                        : "#f3f4f6",
                                        color:
                                            status === "PASSED"
                                                ? "#166534"
                                                : status === "IN_PROGRESS"
                                                    ? "#075985"
                                                    : status === "FAILED" || status === "REJECTED"
                                                        ? "#7f1d1d"
                                                        : "#6b7280",
                                        borderRadius: 10,
                                        padding: 10,
                                        fontSize: 11,
                                        textAlign: "center",
                                        fontWeight: 600,
                                    }}
                                >
                                    {status}
                                </div>
                            );
                        })}
                    </>
                ))}
            </div>
        </div>
    );
}
