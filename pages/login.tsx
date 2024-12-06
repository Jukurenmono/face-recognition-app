import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/auth/AuthContext';
import Image from 'next/image'
import LogoIcon from '../public/login.svg'

const LoginPage: React.FC = () => {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const router = useRouter();
    const { login, user } = useAuth();

const handleLogin = () => {
    if(username === 'admin' && password === 'password'){
        login({username, password});
    } else {
        alert('Wrong username or password');
    }
}

useEffect(() => {
    if(user){
        router.push('/main')
    }
}, [router, user])

  return (
    <div className="flex inset-0 justify-center items-center overflow-hidden h-screen bg-[#EDEDED]">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex w-[700px]">
        <div className="bg-white flex flex-col items-center justify-center w-1/2">
        <Image src={LogoIcon} alt='LogoIcon'/>
        </div>

        <div className="p-10 w-1/2">
        <h2 className="text-3xl font-bold text-[#387478] mb-6 text-center">LOGIN</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
            <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="email">Username</label>
            <div className="relative mt-1">
                <input 
                type="text" 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username" 
                className="block w-full px-4 py-2 text-gray-700 bg-[#E2F1E7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-600" htmlFor="password">Password</label>
            <div className="relative mt-1">
                <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="block w-full px-4 py-2 text-gray-700 bg-[#E2F1E7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            </div>

            <div className="justify-self-center">
                <button 
                    type="submit" 
                    className="py-2 px-10 bg-[#387478] hover:bg-[#529093] text-white rounded-full font-bold"
                    >
                    LOGIN
                </button>
            </div>
        </form>
        </div>
    </div>
    </div>
  );
};

export default LoginPage;
