import React, { useState, useEffect } from "react";
import {
  FiSmartphone,
  FiMonitor,
  FiArrowRight,
  FiMaximize2,
} from "react-icons/fi";

const MobileOnlyGuard = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    checkDevice();

    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const handleContinue = () => {
    setDismissed(true);

    console.log(
      "%c📱 Best Experience: Press F12 → Ctrl + Shift + M",
      "background:#ff7b00;color:white;padding:10px;font-size:16px;border-radius:8px;"
    );
  };

  // MOBILE USERS
  if (!isDesktop) {
    return children;
  }

  // DESKTOP PREVIEW MODE
  if (dismissed) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ff7b00]/10 blur-[120px] rounded-full"></div>

        {/* DESKTOP LABEL */}
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-[#1A1A1A]/90 backdrop-blur-xl border border-white/5 rounded-full px-5 py-3 flex items-center gap-3 shadow-2xl">
            <FiMonitor className="text-[#ff7b00]" />

            <p className="text-sm text-white">
              Desktop Preview Mode
            </p>

            <div className="w-1 h-1 rounded-full bg-white/20"></div>

            <p className="text-xs text-[#8E8E93]">
              Recommended width: 430px
            </p>
          </div>
        </div>

        {/* MOBILE FRAME */}
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="relative w-[430px] max-w-full h-[90vh] rounded-[48px] border-[10px] border-[#2A2A2A] bg-black shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden">

            {/* TOP NOTCH */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[34px] bg-black rounded-b-[24px] z-50"></div>

            {/* APP CONTENT */}
            <div className="w-full h-full overflow-y-auto bg-[#0D0D0D] no-scrollbar">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // INITIAL DESKTOP SCREEN
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0D0D0D] overflow-hidden flex items-center justify-center px-6">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#ff7b00]/10 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#ff7b00]/10 blur-[120px] rounded-full"></div>

      {/* CARD */}
      <div className="relative max-w-md w-full bg-[#161616]/95 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.9)]">

        {/* ICON */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 bg-[#ff7b00]/20 blur-3xl rounded-full"></div>

          <div className="relative w-full h-full bg-[#111111] border border-white/10 rounded-[32px] flex items-center justify-center">
            <FiSmartphone
              size={46}
              className="text-[#ff7b00]"
            />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Mobile Experience
        </h1>

        <p className="text-[#8E8E93] leading-relaxed mb-8">
          DeliverNow is optimized for mobile devices to provide
          the best food delivery experience with immersive UI,
          food reels, and modern interactions.
        </p>

        {/* STEPS */}
        <div className="bg-[#111111] border border-white/5 rounded-[28px] p-5 text-left mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FiMaximize2 className="text-[#ff7b00]" />
            Desktop Preview Steps
          </h3>

          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="text-[#ff7b00] font-bold">
                1.
              </span>

              <p className="text-sm text-[#8E8E93]">
                Press <span className="text-white">F12</span>
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-[#ff7b00] font-bold">
                2.
              </span>

              <p className="text-sm text-[#8E8E93]">
                Enable Device Toolbar using{" "}
                <span className="text-white">
                  Ctrl + Shift + M
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-[#ff7b00] font-bold">
                3.
              </span>

              <p className="text-sm text-[#8E8E93]">
                Select iPhone 14 Pro for best experience
              </p>
            </div>
          </div>
        </div>


        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-[4px] text-[#8E8E93]">
            Optimized for iOS & Android
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileOnlyGuard;
