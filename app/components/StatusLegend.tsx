export default function StatusLegend() {
    return (
        <div className="legend">
            <span className="legend-item passed">PASSED</span>
            <span className="legend-item inprogress">IN PROGRESS</span>
            <span className="legend-item failed">FAILED</span>
            <span className="legend-item notstarted">NOT STARTED</span>
        </div>
    );
}
