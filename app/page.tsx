"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import StatusModal from "./components/StatusModal";
import StatusLegend from "./components/StatusLegend";
import "./pipeline.css";

export default function HomePage() {
  const router = useRouter();

  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<{
    appId: string;
    stageIndex: number;
  } | null>(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      router.push("/login");
      return;
    }
    await loadData();
    setLoading(false);
  }

  /* ================= DATA ================= */
  async function loadData() {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        current_stage_index,
        status,
        failed_stage_index,
        candidates:applications_candidate_id_fkey (
          id,
          name,
          email,
          job_title,
          experience_years,
          skills
        )
      `);

    console.log("APPLICATIONS", data, error);
    setApps(data || []);
  }

  /* ================= WORKFLOW ================= */
  const workflow = [
    "Screening",
    "Internal L1",
    "Internal L2",
    "Client L1",
    "Client L2",
    "HR Round",
    "Offer",
  ];

  /* ================= COUNTS ================= */
  const inProgressCount = apps.filter(
    a => a.status === "IN_PROGRESS"
  ).length;

  const hiredCount = apps.filter(
    a => a.status === "HIRED"
  ).length;

  const rejectedCount = apps.filter(
    a => a.status === "REJECTED"
  ).length;

  /* ================= STATUS LOGIC ================= */
  function getStageStatus(app: any, stageIndex: number) {
    const offerIndex = workflow.length - 1;

    /* ===== REJECTED FLOW ===== */
    if (app.status === "REJECTED" && app.failed_stage_index !== null) {
      if (stageIndex < app.failed_stage_index) return "PASSED";
      if (stageIndex === app.failed_stage_index) return "FAILED";
      if (stageIndex === offerIndex) return "REJECTED";
      return "NOT_STARTED";
    }

    /* ===== HIRED ===== */
    if (app.status === "HIRED") {
      if (stageIndex === offerIndex) return "HIRED";
      return "PASSED";
    }

    /* ===== NORMAL FLOW ===== */
    if (stageIndex < app.current_stage_index) return "PASSED";
    if (stageIndex === app.current_stage_index) return "IN_PROGRESS";
    return "NOT_STARTED";
  }

  /* ================= SAVE ================= */
  async function saveStatus(status: string) {
    if (!selected) return;

    await fetch("/api/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: selected.appId,
        stageIndex: selected.stageIndex,
        status,
      }),
    });

    setSelected(null);
    loadData();
  }

  if (loading) return <p style={{ padding: 12 }}>Loading...</p>;

  return (
    <>
      <StatusLegend />

      {/* ===== SUMMARY BAR ===== */}
      <div className="summary-bar">
        <div className="summary inprogress">
          <span>In Progress</span>
          <strong>{inProgressCount}</strong>
        </div>

        <div className="summary hired">
          <span>Hired</span>
          <strong>{hiredCount}</strong>
        </div>

        <div className="summary rejected">
          <span>Rejected</span>
          <strong>{rejectedCount}</strong>
        </div>
      </div>

      <div className="table">
        {/* HEADER */}
        <div className="row header">
          <div>Candidate</div>
          {workflow.map(stage => (
            <div key={stage}>{stage}</div>
          ))}
        </div>

        {/* ROWS */}
        {apps.map(app => (
          <div key={app.id} className="row">
            {/* ===== CANDIDATE COLUMN ===== */}
            <div className="candidate">
              <strong>{app.candidates?.name}</strong>
              <div className="email">{app.candidates?.email}</div>

              {app.candidates?.job_title && (
                <div className="role">
                  {app.candidates.job_title}
                  {app.candidates.experience_years
                    ? ` • ${app.candidates.experience_years} yrs`
                    : ""}
                </div>
              )}

              {Array.isArray(app.candidates?.skills) &&
                app.candidates.skills.length > 0 && (
                  <div className="skills">
                    {app.candidates.skills.map(
                      (skill: string, i: number) => (
                        <span key={i} className="skill-chip">
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                )}

              <div className="progress">
                <div
                  className="progress-fill"
                  style={{
                    width: `${((app.current_stage_index + 1) / workflow.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* ===== STAGES ===== */}
            {workflow.map((_, index) => {
              const status = getStageStatus(app, index);

              const isDisabled =
                app.status === "REJECTED" && app.failed_stage_index !== null
                  ? index > app.failed_stage_index
                  : index > app.current_stage_index;

              return (
                <div
                  key={index}
                  className={`cell status-${status} ${isDisabled ? "disabled" : ""}`}
                  onClick={() => {
                    if (!isDisabled) {
                      setSelected({ appId: app.id, stageIndex: index });
                    }
                  }}
                >
                  {status}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <StatusModal
        open={!!selected}
        isOffer={selected?.stageIndex === workflow.length - 1}
        onClose={() => setSelected(null)}
        onSave={saveStatus}
      />
    </>
  );
}
