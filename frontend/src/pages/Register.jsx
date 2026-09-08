import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { LuMail, LuLock, LuUser } from "react-icons/lu";
import { PiBookOpenTextDuotone as BookIcon } from "react-icons/pi";
import FormInput from "../components/FormInput";
import { registerUser, googleLogin, clearError } from "../store/authSlice";
const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
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
    const payload = {
      name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      email: form.email,
      password: form.password
    };
    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
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
          <h1 className="font-serif italic text-2xl">Create your account</h1>
          <p className="text-sm text-paper-sub dark:text-ink-sub mt-1">Start reading in a minute</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <FormInput icon={LuUser} type="text" name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
            <FormInput icon={LuUser} type="text" name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
          </div>
          <FormInput icon={LuMail} type="email" name="email" placeholder="name@example.com" value={form.email} onChange={handleChange} required />
          <FormInput icon={LuLock} type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button type="submit" disabled={status === "loading"} className="w-full py-2.5 rounded-md text-sm font-medium bg-gold text-ink-bg disabled:opacity-60 transition">
            {status === "loading" ? "Creating account..." : "Create account"}
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
          Already have an account?{" "}
          <Link to="/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>;
};
export default Register;
