"use client";
import ButtonComponent from "../base/ButtonComponent";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

const HeaderComponent = () => {
  const { user, error, isLoading } = useUser();
  const isUserLoggedIn = user;

  const router = useRouter();

  const handleAuthRouting = () => {
    if (isUserLoggedIn) router.push("/api/auth/logout");
    router.push("/api/auth/login");
  };

  return (
    <header className="w-screen flex justify-end p-4">
      <ButtonComponent
        onClick={handleAuthRouting}
        title={isUserLoggedIn ? "Logout" : "Sign in"}
      />
    </header>
  );
};

export default HeaderComponent;
