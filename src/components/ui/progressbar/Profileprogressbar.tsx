'use client'

interface ProgressBarProps{
    progress : number
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="position-relative mt-3 px-3 progress_info bg-dark p-4 rounded text-center w-100" style={{ maxWidth: "300px" }}>
      {/* Title */}
      <h2 className="text-white fs-5 fw-semibold mb-2">Progress</h2>

      {/* Progress Bar */}
      <div className="progress" style={{ height: "12px" }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${progress}%` }}
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
