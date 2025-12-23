"use client";

export default function StageModal({
    open,
    onClose,
    candidate,
    stage,
    onUpdate,
}: any) {
    if (!open) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>{candidate?.candidates?.name}</h3>
                <p>Stage: <strong>{stage}</strong></p>

                <div className="modal-actions">
                    <button onClick={() => onUpdate("PASSED")} className="passed">
                        Passed
                    </button>
                    <button onClick={() => onUpdate("IN_PROGRESS")} className="inprogress">
                        In Progress
                    </button>
                    <button onClick={() => onUpdate("FAILED")} className="failed">
                        Failed
                    </button>
                </div>

                <button className="close-btn" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
