import { useState } from "react";
import Image from "next/image";

const Login = () => {
  // State to manage the modal's open/close state
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 ">
      {/* Open Login Modal Button */}
      <button
        className="px-4 py-2 text-white bg-blue-600 rounded-lg"
        onClick={() => setIsOpen(true)}
      >
        Login
      </button>

      {/* Popup Modal - Displays when isOpen is true */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 position-fixed connect_wallet top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          {/* Dark overlay background */}
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
            {/* Modal Content */}
            <div className="bg-[#121212] text-white p-6 rounded-2xl shadow-lg w-[380px] relative">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                X
              </button>

              {/* Modal Title */}
              <h2 className="text-xl font-semibold text-center">
                Connect or create wallet
              </h2>

              {/* Wallet Icon */}
              <div className="flex justify-center  my-4">
                <Image
                  src="/wallet-icon.png"
                  alt="Wallet Icon"
                  className="w-12 h-12"
                />
              </div>

              {/* Subtitle */}
              <p className="text-green-400 text-center text-sm">
                privy wallet - zero confirmation trading
              </p>

              {/* Login and Wallet Options */}
              <div className="mt-4 space-y-3">
                {/* Login with email or social accounts */}
                <button className="flex items-center justify-between w-full px-4 py-3 bg-gray-800 rounded-lg">
                  <span>Login with email or socials</span>
                  <span>➜</span>
                </button>

                {/* Divider */}
                <div className="flex items-center justify-center my-2">
                  <div className="border-t border-gray-600 w-1/3"></div>
                  <span className="mx-2 text-gray-400">or</span>
                  <div className="border-t border-gray-600 w-1/3"></div>
                </div>

                {/* Solflare Wallet Button */}
                <button className="flex items-center w-full px-4 py-3 bg-gray-800 rounded-lg">
                  <Image src="/solflare.png" alt="Solflare" className="w-5 h-5 mr-3" />
                  <span>Solflare</span>
                </button>

                {/* More Wallets Button */}
                <button className="flex items-center w-full px-4 py-3 bg-gray-800 rounded-lg">
                  <Image src="/wallet-icon.png" alt="More Wallets" className="w-5 h-5 mr-3" />
                  <span>More wallets</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
