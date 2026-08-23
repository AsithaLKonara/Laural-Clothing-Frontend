"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Calendar, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  changePasswordSchema,
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ChangePasswordFormData,
} from "@/lib/validations";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

type AuthView = "login" | "register" | "forgot-password" | "otp" | "change-password";

export default function AuthForm() {
  const [view, setView] = useState<AuthView>("login");

  const renderView = () => {
    switch (view) {
      case "login":
        return <LoginForm setView={setView} />;
      case "register":
        return <RegisterForm setView={setView} />;
      case "forgot-password":
        return <ForgotPasswordForm setView={setView} />;
      case "otp":
        return <OTPForm setView={setView} />;
      case "change-password":
        return <ChangePasswordForm setView={setView} />;
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

// Subcomponents

function LoginForm({ setView }: { setView: (v: AuthView) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect");
  const loginAction = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);

    try {
      const result = await loginAction(data);
      const userRoles = result.user.roles || [];
      const isStaffOrAdmin = userRoles.some(
        (r) => r.toUpperCase() !== "PUBLIC_USER" && r.toLowerCase() !== "public user"
      );

      if (redirect) {
        router.push(redirect);
      } else if (isStaffOrAdmin) {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to sign in. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-[24px]">
        <div className="flex flex-col w-full gap-[16px]">
          <div className="w-full">
            <input 
              type="email" 
              placeholder="Email Address"
              {...register("email")}
              className={`w-full h-[56px] px-[20px] bg-black/20 backdrop-blur-md border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all`}
            />
            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
          </div>
          
          <div className="w-full">
            <div className="relative w-full">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                {...register("password")}
                className={`w-full h-[56px] pl-[20px] pr-[50px] bg-black/20 backdrop-blur-md border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[20px] top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-50 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
          </div>

          <div className="flex justify-end w-full">
            <button 
              type="button"
              onClick={() => setView("forgot-password")}
              className="font-urbanist font-medium text-xs text-stone-400 hover:text-stone-50 transition-colors tracking-wide uppercase"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/50 text-red-400 text-sm px-4 py-3 text-center">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="group w-full h-[56px] bg-stone-50 flex justify-between items-center px-[24px] hover:bg-stone-200 transition-colors disabled:opacity-50">
          <span className="font-urbanist font-bold text-sm text-black uppercase tracking-[0.1em]">
            {loading ? "Signing In..." : "Sign In"}
          </span>
          {!loading && <ArrowRight className="w-5 h-5 text-black transform group-hover:translate-x-1 transition-transform" />}
        </button>

        <div className="flex flex-col items-center w-full gap-[24px] mt-2">
          <div className="flex flex-row items-center justify-center w-full gap-[12px]">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="font-urbanist font-medium text-xs text-stone-400 uppercase tracking-widest">
              Or Continue With
            </span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
          <button type="button" className="flex flex-row items-center justify-center w-full h-[56px] gap-[12px] bg-transparent border border-white/10 hover:bg-white/5 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-urbanist font-medium text-sm text-stone-50">Google</span>
          </button>
        </div>
      </form>

      <div className="flex flex-row justify-center items-center gap-[8px] w-full mt-4">
        <span className="font-poppins font-light text-sm text-stone-400">
          New to Laural?
        </span>
        <button 
          type="button"
          onClick={() => setView("register")}
          className="font-poppins font-medium text-sm text-stone-50 hover:text-stone-300 transition-colors underline underline-offset-4"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}

function RegisterForm({ setView }: { setView: (v: AuthView) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect");
  const registerAction = useAuthStore((state) => state.register);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setLoading(true);

    try {
      await registerAction({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        birthday: data.birthday || null,
        phone: data.phone || null,
      });

      setSuccess(true);
      setTimeout(() => {
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/account");
        }
      }, 1000);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to create account. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-[32px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center gap-[8px]">
        <h2 className="font-inria text-4xl md:text-5xl leading-[1.2] text-center text-stone-50 tracking-wide">
          Join Laural
        </h2>
        <p className="font-poppins font-light text-sm text-stone-400 text-center">
          Discover pieces edited for quiet luxury.
        </p>
      </div>

      {success ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center animate-in fade-in">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          <h3 className="font-inria text-2xl text-stone-50">Welcome to Laural</h3>
          <p className="font-urbanist text-stone-400 text-sm">Your account has been created. Redirecting you...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-[16px]">
          <div className="w-full">
            <input 
              type="text" 
              placeholder="Full Name" 
              {...register("fullName")}
              className={`w-full h-[56px] px-[20px] bg-black/20 backdrop-blur-md border ${errors.fullName ? 'border-red-500' : 'border-white/10'} rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all`}
            />
            {errors.fullName && <span className="text-red-500 text-xs mt-1 block">{errors.fullName.message}</span>}
          </div>

          <div className="w-full">
            <input 
              type="email" 
              placeholder="Email Address" 
              {...register("email")}
              className={`w-full h-[56px] px-[20px] bg-black/20 backdrop-blur-md border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all`}
            />
            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
          </div>

          <div className="w-full">
            <div className="relative w-full">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password (min. 8 characters)" 
                {...register("password")}
                className={`w-full h-[56px] pl-[20px] pr-[50px] bg-black/20 backdrop-blur-md border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[20px] top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-50 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
          </div>

          {/* Birthday Field (Optional) */}
          <div className="w-full">
            <div className="relative w-full">
              <input 
                type="date"
                placeholder="Birthday (Optional)"
                {...register("birthday")}
                className="w-full h-[56px] px-[20px] bg-black/20 backdrop-blur-md border border-white/10 rounded-none font-urbanist font-light text-sm text-stone-200 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all [color-scheme:dark]"
              />
            </div>
            <span className="text-stone-400 text-xs mt-1 block pl-1">Optional — Receive an exclusive birthday gift & offer</span>
          </div>

          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/50 text-red-400 text-sm px-4 py-3 text-center">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="group w-full h-[56px] bg-stone-50 flex justify-between items-center px-[24px] hover:bg-stone-200 transition-colors mt-[8px] disabled:opacity-50">
            <span className="font-urbanist font-bold text-sm text-black uppercase tracking-[0.1em]">
              {loading ? "Creating Account..." : "Create Account"}
            </span>
            {!loading && <ArrowRight className="w-5 h-5 text-black transform group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      )}

      <div className="flex flex-row justify-center items-center gap-[8px] w-full mt-2">
        <span className="font-poppins font-light text-sm text-stone-400">
          Already have an account?
        </span>
        <button 
          type="button"
          onClick={() => setView("login")}
          className="font-poppins font-medium text-sm text-stone-50 hover:text-stone-300 transition-colors underline underline-offset-4"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

function ForgotPasswordForm({ setView }: { setView: (v: AuthView) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log("Forgot password data:", data);
    setView("otp");
  };

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
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-[16px]">
        <div className="w-full">
          <input 
            type="email" 
            placeholder="Email Address" 
            {...register("email")}
            className={`w-full h-[56px] px-[20px] bg-black/20 backdrop-blur-md border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all`}
          />
          {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
        </div>
        <button 
          type="submit"
          className="group w-full h-[56px] bg-stone-50 flex justify-between items-center px-[24px] hover:bg-stone-200 transition-colors mt-[8px]"
        >
          <span className="font-urbanist font-bold text-sm text-black uppercase tracking-[0.1em]">
            Send OTP
          </span>
          <ArrowRight className="w-5 h-5 text-black transform group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="flex flex-row justify-center items-center w-full mt-4">
        <button 
          type="button"
          onClick={() => setView("login")}
          className="font-poppins font-medium text-sm text-stone-400 hover:text-stone-50 transition-colors underline underline-offset-4"
        >
          Return to Sign In
        </button>
      </div>
    </div>
  );
}

function OTPForm({ setView }: { setView: (v: AuthView) => void }) {
  const handleVerify = () => setView("change-password");

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
          onClick={handleVerify}
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
        <button type="button" className="font-poppins font-medium text-sm text-stone-50 hover:text-stone-300 transition-colors underline underline-offset-4">
          Resend
        </button>
      </div>
    </div>
  );
}

function ChangePasswordForm({ setView }: { setView: (v: AuthView) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    console.log("Change password data:", data);
    setView("login");
  };

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
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-[16px]">
        <div className="w-full">
          <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="New Password" 
              {...register("password")}
              className={`w-full h-[56px] pl-[20px] pr-[50px] bg-black/20 backdrop-blur-md border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all`}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[20px] top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-50 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
        </div>

        <div className="w-full">
          <div className="relative w-full">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm New Password" 
              {...register("confirmPassword")}
              className={`w-full h-[56px] pl-[20px] pr-[50px] bg-black/20 backdrop-blur-md border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-none font-urbanist font-light text-sm text-stone-50 placeholder:text-stone-400 focus:outline-none focus:border-stone-50 focus:bg-black/40 transition-all`}
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-[20px] top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-50 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword.message}</span>}
        </div>

        <button 
          type="submit"
          className="group w-full h-[56px] bg-stone-50 flex justify-between items-center px-[24px] hover:bg-stone-200 transition-colors mt-[8px]"
        >
          <span className="font-urbanist font-bold text-sm text-black uppercase tracking-[0.1em]">
            Save Password
          </span>
          <ArrowRight className="w-5 h-5 text-black transform group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}
