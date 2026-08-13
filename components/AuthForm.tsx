"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

type AuthView = "login" | "register" | "forgot-password" | "otp" | "change-password";

export default function AuthForm() {
  const [view, setView] = useState<AuthView>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const renderView = () => {
    switch (view) {
      case "login":
        return (
          <div className="flex flex-col items-center w-full gap-[36px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center gap-[8px]">
              <h2 className="font-inria text-4xl md:text-5xl leading-[1.2] text-center text-stone-50 tracking-wide">
                Welcome Back
              </h2>
              <p className="font-poppins font-light text-sm text-stone-400 text-center">
                Sign in to access your curated collections.
              </p>
            </div>

            <div className="flex flex-col w-full gap-[24px]">
              <div className="flex flex-col w-full gap-[16px]">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full h-[56px] px-[20px] bg-black/20 backdrop-blur-md border border-white/10 rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all"
                />
                <div className="relative w-full">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    className="w-full h-[56px] pl-[20px] pr-[50px] bg-black/20 backdrop-blur-md border border-white/10 rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[20px] top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-50 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-end w-full">
                  <button 
                    onClick={() => setView("forgot-password")}
                    className="font-urbanist font-medium text-xs text-stone-400 hover:text-stone-50 transition-colors tracking-wide uppercase"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button className="group w-full h-[56px] bg-stone-50 flex justify-between items-center px-[24px] hover:bg-stone-200 transition-colors">
                <span className="font-urbanist font-bold text-sm text-black uppercase tracking-[0.1em]">
                  Sign In
                </span>
                <ArrowRight className="w-5 h-5 text-black transform group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex flex-col items-center w-full gap-[24px] mt-2">
                <div className="flex flex-row items-center justify-center w-full gap-[12px]">
                  <div className="flex-1 h-[1px] bg-white/10" />
                  <span className="font-urbanist font-medium text-xs text-stone-400 uppercase tracking-widest">
                    Or Continue With
                  </span>
                  <div className="flex-1 h-[1px] bg-white/10" />
                </div>
                <button className="flex flex-row items-center justify-center w-full h-[56px] gap-[12px] bg-transparent border border-white/10 hover:bg-white/5 transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="font-urbanist font-medium text-sm text-stone-50">Google</span>
                </button>
              </div>
            </div>

            <div className="flex flex-row justify-center items-center gap-[8px] w-full mt-4">
              <span className="font-poppins font-light text-sm text-stone-400">
                New to Laural?
              </span>
              <button 
                onClick={() => setView("register")}
                className="font-poppins font-medium text-sm text-stone-50 hover:text-stone-300 transition-colors underline underline-offset-4"
              >
                Create an account
              </button>
            </div>
          </div>
        );
      
      case "register":
        return (
          <div className="flex flex-col items-center w-full gap-[36px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center gap-[8px]">
              <h2 className="font-inria text-4xl md:text-5xl leading-[1.2] text-center text-stone-50 tracking-wide">
                Join Laural
              </h2>
              <p className="font-poppins font-light text-sm text-stone-400 text-center">
                Discover pieces edited for quiet luxury.
              </p>
            </div>
            
            <div className="flex flex-col w-full gap-[16px]">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full h-[56px] px-[20px] bg-black/20 backdrop-blur-md border border-white/10 rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full h-[56px] px-[20px] bg-black/20 backdrop-blur-md border border-white/10 rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all"
              />
              <div className="relative w-full">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="w-full h-[56px] pl-[20px] pr-[50px] bg-black/20 backdrop-blur-md border border-white/10 rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[20px] top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-50 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button className="group w-full h-[56px] bg-stone-50 flex justify-between items-center px-[24px] hover:bg-stone-200 transition-colors mt-[8px]">
                <span className="font-urbanist font-bold text-sm text-black uppercase tracking-[0.1em]">
                  Create Account
                </span>
                <ArrowRight className="w-5 h-5 text-black transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex flex-row justify-center items-center gap-[8px] w-full mt-4">
              <span className="font-poppins font-light text-sm text-stone-400">
                Already have an account?
              </span>
              <button 
                onClick={() => setView("login")}
                className="font-poppins font-medium text-sm text-stone-50 hover:text-stone-300 transition-colors underline underline-offset-4"
              >
                Sign In
              </button>
            </div>
          </div>
        );

      case "forgot-password":
        return (
          <div className="flex flex-col items-center w-full gap-[36px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center gap-[8px]">
              <h2 className="font-inria text-4xl md:text-[36px] leading-[1.2] text-center text-stone-50 tracking-wide">
                Forgot Password
              </h2>
              <p className="font-poppins font-light text-sm text-stone-400 text-center max-w-[280px]">
                Enter your email address to receive an OTP verification code.
              </p>
            </div>
            
            <div className="flex flex-col w-full gap-[16px]">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full h-[56px] px-[20px] bg-black/20 backdrop-blur-md border border-white/10 rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all"
              />
              <button 
                onClick={() => setView("otp")}
                className="group w-full h-[56px] bg-stone-50 flex justify-between items-center px-[24px] hover:bg-stone-200 transition-colors mt-[8px]"
              >
                <span className="font-urbanist font-bold text-sm text-black uppercase tracking-[0.1em]">
                  Send OTP
                </span>
                <ArrowRight className="w-5 h-5 text-black transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex flex-row justify-center items-center w-full mt-4">
              <button 
                onClick={() => setView("login")}
                className="font-poppins font-medium text-sm text-stone-400 hover:text-stone-50 transition-colors underline underline-offset-4"
              >
                Return to Sign In
              </button>
            </div>
          </div>
        );

      case "otp":
        return (
          <div className="flex flex-col items-center w-full gap-[36px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center gap-[8px]">
              <h2 className="font-inria text-4xl md:text-[36px] leading-[1.2] text-center text-stone-50 tracking-wide">
                Verification
              </h2>
              <p className="font-poppins font-light text-sm text-stone-400 text-center max-w-[280px]">
                We've sent a 6-digit code to your email. Enter it below.
              </p>
            </div>
            
            <div className="flex flex-col w-full gap-[24px]">
              <div className="flex justify-between w-full gap-[8px]">
                {[...Array(6)].map((_, i) => (
                  <input 
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-full h-[56px] text-center bg-black/20 backdrop-blur-md border border-white/10 rounded-none font-urbanist font-medium text-xl text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all"
                  />
                ))}
              </div>
              <button 
                onClick={() => setView("change-password")}
                className="group w-full h-[56px] bg-stone-50 flex justify-between items-center px-[24px] hover:bg-stone-200 transition-colors"
              >
                <span className="font-urbanist font-bold text-sm text-black uppercase tracking-[0.1em]">
                  Verify Code
                </span>
                <ArrowRight className="w-5 h-5 text-black transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex flex-row justify-center items-center gap-[8px] w-full mt-4">
              <span className="font-poppins font-light text-sm text-stone-400">
                Didn't receive code?
              </span>
              <button className="font-poppins font-medium text-sm text-stone-50 hover:text-stone-300 transition-colors underline underline-offset-4">
                Resend
              </button>
            </div>
          </div>
        );

      case "change-password":
        return (
          <div className="flex flex-col items-center w-full gap-[36px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center gap-[8px]">
              <h2 className="font-inria text-4xl md:text-[36px] leading-[1.2] text-center text-stone-50 tracking-wide">
                New Password
              </h2>
              <p className="font-poppins font-light text-sm text-stone-400 text-center max-w-[280px]">
                Create a new password for your account.
              </p>
            </div>
            
            <div className="flex flex-col w-full gap-[16px]">
              <div className="relative w-full">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="New Password" 
                  className="w-full h-[56px] pl-[20px] pr-[50px] bg-black/20 backdrop-blur-md border border-white/10 rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[20px] top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-50 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative w-full">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm New Password" 
                  className="w-full h-[56px] pl-[20px] pr-[50px] bg-black/20 backdrop-blur-md border border-white/10 rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-[20px] top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-50 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button 
                onClick={() => setView("login")}
                className="group w-full h-[56px] bg-stone-50 flex justify-between items-center px-[24px] hover:bg-stone-200 transition-colors mt-[8px]"
              >
                <span className="font-urbanist font-bold text-sm text-black uppercase tracking-[0.1em]">
                  Save Password
                </span>
                <ArrowRight className="w-5 h-5 text-black transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-[380px] mx-auto h-full min-h-[400px]">
      {renderView()}
    </div>
  );
}
