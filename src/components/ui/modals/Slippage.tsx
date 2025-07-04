'use client';

import { useState } from 'react';

interface SlippageProps {
    value: number;
    onChange: (val: number) => void;
}

export default function Slippage({ value, onChange }: SlippageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useState(value);

  const presetValues = [5, 10, 15, 50];

    const handlePresetClick = (val: number) => {
        setSlippage(val);
    };

    const handleApply = () => {
        onChange(slippage);  // Pass slippage to parent
        setIsOpen(false);
    };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="max_slip"
      >
       Slippage
      </button>

      {isOpen && (
        <div className="slippage_modal  connect_wallet "
         style={{ zIndex: 1050 }}
        //  onClick={() => setIsOpen(false)}
        >
          <div className="modal-dialog-body">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute btn-close top-2 right-3 text-white text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Slippage</h2>
            <p className="text-sm text-blue-400 mb-4">
              Set the maximum amount of slippage upto 50%
            </p>

            <div className="flex items-center bg-zinc-800 p-2 rounded mb-4">
              <span className="text-gray-400 mr-2">%</span>
                <input
                    type="text"
                    value={slippage}
                    onChange={(e) => {
                        const input = e.target.value.trim();
                        if (!/^\d*$/.test(input)) return;
                        const val = Number(input);
                        if (val <= 50) {
                            setSlippage(val);
                        }
                    }}
                    className="bg-transparent text-white outline-none w-full"
                />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                    onClick={() => handlePresetClick(0)} // or setSlippage(0) if you want a true "reset"
                    className={`py-1 rounded ${
                        slippage === 5 ? 'bg-green-600' : 'bg-zinc-700'
                    }`}
                >
                    Reset
                </button>
              {presetValues.map((val) => (
                <button
                  key={val}
                  onClick={() => handlePresetClick(val)}
                  className={`py-1 rounded ${
                    slippage === val ? 'bg-green-600' : 'bg-zinc-700'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                  handleApply()
              }}
              className="apply_btn"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </>
  );
}
