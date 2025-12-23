"use client";

export default function StatusModal({
    open,
    onClose,
    onSave,
    isOffer,
}: {
    open: boolean;
    onClose: () => void;
    onSave: (status: string) => void;
    isOffer?: boolean;
}) {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>{isOffer ? "Final Offer Decision" : "Update Stage Status"}</h3>

                {/* ===== OFFER STAGE ===== */}
                {isOffer ? (
                    <>
                        <button
                            className="status-HIRED"
                            onClick={() => onSave("HIRED")}
                        >
                            Hire Candidate
                        </button>

                        <button
                            className="status-REJECTED"
                            onClick={() => onSave("FAILED")}
                        >
                            Reject Candidate
                        </button>
                    </>
                ) : (
                    /* ===== NORMAL STAGES ===== */
                    <>
                        <button
                            className="status-PASSED"
                            onClick={() => onSave("PASSED")}
                        >
                            Pass Stage
                        </button>

                        <button
                            className="status-FAILED"
                            onClick={() => onSave("FAILED")}
                        >
                            Fail Stage
                        </button>
                    </>
                )}

                <button className="close" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
