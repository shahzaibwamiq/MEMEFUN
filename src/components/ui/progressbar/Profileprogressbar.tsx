'use client'

// Define the properties for the ProgressBar component
interface ProgressBarProps {
  progress: number // Progress value as a percentage (0-100)
}

/**
 * ProgressBar Component
 * Displays a progress bar with a custom background and percentage value.
 */
const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div
      className="position-relative mt-3 px-3 progress_info  p-4 rounded text-center w-100 progress_bar_cs"
      style={{ maxWidth: "100%" }}
    >
      {/* Progress Bar Container */}
      <div className="progress" style={{ height: "27px" }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{
            width: `${progress}%`,
            backgroundColor: "rgb(239, 77, 139) !important" 
          }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>

      {/* Progress Percentage */}
      <span className="text-white fw-bold mt-2 d-block">{progress}%</span>
    </div>
  );
};

export default ProgressBar;
