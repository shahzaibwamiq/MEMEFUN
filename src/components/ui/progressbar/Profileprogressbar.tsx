'use client'

interface ProgressBarProps{
    progress : number
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="position-relative mt-3 px-3 progress_info  p-4 rounded text-center w-100 progress_bar_cs" style={{ maxWidth: "100%" }}>
      {/* Title */}

      {/* Progress Bar */}
      <div className="progress" style={{ height: "27px" }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${progress}%` , background: "url('/assets/img/profile/prog.png') no-repeat center center/cover" }}
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
