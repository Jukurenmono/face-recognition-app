import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/router";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }   
    }, [user, router]);

    const handleLogin = () => {
        const values = {
            username: username,
            password: password,
        };
        login(values);
    };

    return (
        <div className="flex min-h-screen justify-center items-center p-4">
            <div className="flex items-center justify-center w-full md:w-1/2">
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Enter Email"
                                className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm h-12 pl-3 focus:border-blue-500 focus:outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm h-12 pl-3 focus:border-blue-500 focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            className="w-full mt-5 font-bold bg-black text-white py-3 rounded-md hover:bg-hoverColor transition"
                            type="submit"
                        >Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;