import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    
    // GOOGLE SIGN-IN FUNCTION
    
    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: "http://localhost:5173/dashboard",
            },
        });

        if (error) {
            console.log("Google Sign-In Error:", error.message);
            setMessage(error.message);
        }
    };

   
    // EMAIL + PASSWORD LOGIN
    
    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            setLoading(false);
        } else {
            setMessage("Sign-in successful!");
            setLoading(false);
            navigate("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-emerald-500"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-emerald-500"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-emerald-500"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-emerald-500"></div>
                </div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-full p-4 shadow-2xl border border-emerald-400 transform hover:scale-105 transition-all duration-300 hover:shadow-emerald-500/20">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p className="mt-3 text-sm text-gray-400 font-light">
                        Sign in to access your professional resume builder
                    </p>
                </div>

                {/* SIGN-IN FORM */}
                <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-800 transform transition-all duration-300">
                    <form className="space-y-6" onSubmit={handleSignIn}>
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full pl-10 pr-4 py-3.5 border border-gray-700 rounded-xl bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full pl-10 pr-4 py-3.5 border border-gray-700 rounded-xl bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 text-white font-medium hover:scale-[1.02] transition-all duration-200"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Message */}
                    {message && (
                        <div className={`mt-6 p-4 rounded-xl border ${
                            message.includes("successful") 
                            ? "bg-emerald-900/20 text-emerald-400 border-emerald-800" 
                            : "bg-red-900/20 text-red-400 border-red-800"
                        }`}>
                            <p className="text-sm font-medium">{message}</p>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="mt-8">
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-gray-900 text-gray-500 font-medium">Or continue with</span>
                        </div>
                    </div>

                    {/* SOCIAL LOGIN BUTTON */}
                    <div className="mt-6">
                        {/* GOOGLE BUTTON */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full inline-flex justify-center items-center gap-3 py-3 px-4 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:bg-gray-700 transition"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                            </svg>
                            <span>Continue with Google</span>
                        </button>
                    </div>

                    {/* SIGN UP LINK */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Don’t have an account?
                            <a href="/signup" className="font-medium text-emerald-400 hover:text-emerald-300">
                                Create one now
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
