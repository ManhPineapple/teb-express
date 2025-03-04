import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useRouter } from "@/routes/hooks";
import { userService } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import "react-toastify/dist/ReactToastify.css";
import PageHead from "@/components/shared/page-head";

const LoginPage = () => {
  const router = useRouter();
  const [shouldShowPassword, setShouldShowPassword] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLoginBtnClick = async () => {
    try {
      const loginResponse = await userService.login(email, password);

      if (!loginResponse.access_token) {
        toast.error("Login failed");
        return;
      }
      setIsLogin(true);

      useAuthStore
        .getState()
        .login(loginResponse.access_token, loginResponse.user);

      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Server error");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLoginBtnClick();
    }
  };

  useEffect(() => {
    const authStorageItem = window.localStorage.getItem("auth-storage");
    if (authStorageItem) {
      const authData = JSON.parse(authStorageItem);
      if (authData.state.isLoggedIn) {
        router.push("/dashboard");
      }
    }
  }, [router]);

  return (
    <>
      <PageHead title="Login | Ananbay" />
      <div className="flex h-screen flex-col md:flex-row">
        <div className="flex items-baseline justify-center p-8 m-auto">
          <div className="flex max-w-md flex-col items-center justify-center bg-white">
            <img src="../../../../logo.png" />
            <h1 className="text-center text-lg font-bold leading-6 tracking-tight text-color mt-5">
              SIGN IN
            </h1>

            <form onKeyDown={handleKeyDown}>
              <div>
                <label className="text-sm font-bold leading-5">Email</label>
                <Input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                />
              </div>
              <div className="py-6">
                <label className="text-sm font-bold leading-5">Password</label>
                <div className="relative">
                  <Input
                    type={shouldShowPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                  />
                  <EyeIcon
                    onClick={() => setShouldShowPassword((prev) => !prev)}
                    className="absolute right-0 top-0 h-[38px] w-[38px] px-2"
                  />
                </div>
              </div>
              <Button
                className="mt-6 h-10 w-80 border-primary bg-primary text-center text-white hover:bg-[#8d181b]"
                type="button"
                onClick={() => handleLoginBtnClick()}
                disabled={isLogin}
              >
                Login
              </Button>
              <div>
                <p className="mt-4 text-center">
                  New to Ananbay??
                  <span className="px-2 text-[#8d181b]">
                    <a href="/signup">Sign Up</a>
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export { LoginPage };
