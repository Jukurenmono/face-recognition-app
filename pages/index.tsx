import { useEffect } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/router";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(!user){
      router.push("/login");
    }
  }, [user, router])

  return (
    <></>
  );
};

export default Home;
