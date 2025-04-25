// pages/auth/Register.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import TermsCondition from "./TermsCondition.jsx";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* ---- pick role from /register?role=xyz -------------- */
  const urlRole = new URLSearchParams(location.search).get("role") || "taxpayer";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    role: urlRole,
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ---------------- handlers ---------------- */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setShowTermsModal(true);
  };

  const handleAcceptTerms = async () => {
    setShowTermsModal(false);
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        "http://localhost:5559/users/register",
        formData
      );
      if (!data.success) throw new Error(data.message);

      login(data.token, data.user, true);

      const role = data.user.role;
      if (role === "restaurantOwner") navigate("/restaurant");
      else if (role === "deliveryPerson") navigate("/delivery");
      else navigate("/profile");
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- 3rd-party auth ------------------- */
  const googleLogin = () => (window.location.href = "http://localhost:5559/auth/google");
  const facebookLogin = () => (window.location.href = "http://localhost:5559/auth/facebook");

  /* ------------------- UI ------------------- */
  return (
    <div
      className="w-screen h-screen flex flex-col"
      style={{
        backgroundImage: "url('/backrd4.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white/90 p-10 rounded-lg shadow-xl w-[28rem] backdrop-blur-md">
          {error && <p className="text-red-600 text-center mb-3">{error}</p>}

          {/* ---------- OAuth buttons ---------- */}
          <div className="flex justify-between mb-4 gap-2">
            <button
              onClick={googleLogin}
              className="flex items-center justify-center flex-1 py-2 border border-gray-300 rounded-lg bg-white text-black shadow-sm hover:bg-gray-50"
            >
              <FcGoogle className="w-5 h-5 mr-2" /> Google Login
            </button>
            <button
              onClick={facebookLogin}
              className="flex items-center justify-center flex-1 py-2 border border-gray-300 rounded-lg bg-white text-black shadow-sm hover:bg-gray-50"
            >
              <FaFacebook className="w-5 h-5 mr-2 text-blue-600" /> Facebook Login
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* ---------- Register form ---------- */}
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            {/* confirm */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirmPassword((s) => !s)}
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* ---------- Terms & Conditions modal ---------- */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <TermsCondition
            onAccept={handleAcceptTerms}
            onCancel={() => setShowTermsModal(false)}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
