import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { LuMail, LuLock } from "react-icons/lu";
import { PiBookOpenTextDuotone as BookIcon } from "react-icons/pi";
import FormInput from "../components/FormInput";
import { loginUser, googleLogin, clearError } from "../store/authSlice";
const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    status,
    error
  } = useSelector(state => state.auth);
  const googleReady = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const [googleError, setGoogleError] = useState("");
  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  };
  const handleGoogleSuccess = async credentialResponse => {
    setGoogleError("");
    const result = await dispatch(googleLogin(credentialResponse.credential));
    if (googleLogin.fulfilled.match(result)) {
      navigate("/");
    } else {
      setGoogleError(result.payload || "Google sign-in failed");
    }
  };
  return <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <BookIcon className="text-3xl text-gold mb-2" />
          <h1 className="font-serif italic text-2xl">Welcome back</h1>
          <p className="text-sm text-paper-sub dark:text-ink-sub mt-1">Sign in to keep reading</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormInput icon={LuMail} type="email" name="email" placeholder="name@example.com" value={form.email} onChange={handleChange} required />
          <FormInput icon={LuLock} type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button type="submit" disabled={status === "loading"} className="w-full py-2.5 rounded-md text-sm font-medium bg-gold text-ink-bg disabled:opacity-60 transition">
            {status === "loading" ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {googleReady && <>
            <div className="flex items-center gap-3 my-5">
              <span className="flex-1 h-px bg-paper-border dark:bg-ink-border" />
              <span className="text-xs text-paper-sub dark:text-ink-sub">or</span>
              <span className="flex-1 h-px bg-paper-border dark:bg-ink-border" />
            </div>
            <div className="flex justify-center">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setGoogleError("Google sign-in failed")} theme="filled_black" shape="pill" width="320" />
            </div>
            {googleError && <p className="text-sm text-red-500 text-center mt-3">{googleError}</p>}
          </>}

        <p className="text-sm text-center mt-6 text-paper-sub dark:text-ink-sub">
          New to Chaptr?{" "}
          <Link to="/register" className="text-gold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>;
};
export default Login;
