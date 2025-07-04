'use client';



interface LoaderDetails{
    name?: string;
    fixed? : boolean;
}

const Loader = ({name, fixed = false}:LoaderDetails) => {
    return (
        <div
            className={`top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center ${fixed ? "position-fixed" : "position-absolute"}`}
            style={{
                backgroundColor: "#000000bf",
                zIndex: 10,
                borderRadius: "8px",
            }}
        >
            <svg
                width="60"
                height="60"
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
                style={{ animation: "spin 1s linear infinite" }}
            >
                <defs>
                    {/* Gradient for FUN color scheme */}
                    <linearGradient id="funGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00B9F1" />    {/* F - Blue */}
                        <stop offset="50%" stopColor="#FF4CA5" />   {/* U - Pink */}
                        <stop offset="100%" stopColor="#FDD835" />  {/* N - Yellow */}
                    </linearGradient>
                </defs>
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="url(#funGradient)"
                    strokeWidth="3"
                    strokeDasharray="100"
                    strokeDashoffset="75"
                    strokeLinecap="round"
                />
            </svg>

            <p className="text-white fw-semibold mt-3">{name || "Connecting Wallet..."}</p>

            <style jsx>{`
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
        svg {
          transform-origin: center;
        }
      `}</style>
        </div>
    );
};

export default Loader;
