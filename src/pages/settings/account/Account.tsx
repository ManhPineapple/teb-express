import PageHead from "@/components/shared/page-head";
import { getToken, resetToken, updateUser } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  name: z.string().nonempty("Tên không hợp lệ"),
  password: z.string().min(6, "Vui lòng nhập mật khẩu mới"),
  newPassword: z.string().nonempty("Vui lòng không để trống!"),
});

type FormData = z.infer<typeof schema>;

const Account: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      if (token) setApiKey(token);
    };
    fetchToken();
  }, []);

  const onSubmit = async (data: FormData) => {
    const res = await updateUser({
      password: data.password,
      newPassword: data.newPassword,
      name: data.name,
    });
    if (res.user) toast.success("Cập nhật thành công");
  };

  const handleResetToken = async () => {
    const newToken = await resetToken();
    if (newToken) {
      setApiKey(newToken);
      toast.success("API key đã được tạo lại");
    }
  };

  return (
    <>
      <PageHead title="Setting | Ananbay" />
      <div>
        <h2 className="text-3xl font-medium m-6">Thông tin tài khoản</h2>

        {/* API Key Section */}
        <div className="flex justify-center items-center mt-10">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl">
            <label htmlFor="apiKey" className="block text-gray-700 mb-2">
              API Key:
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                readOnly
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 pr-20"
              />

              {/* Buttons */}
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Copy size={18} />
                  </button>

                  {copied && (
                    <div className="absolute bottom-full mb-2 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow-md animate-fadeIn whitespace-nowrap">
                      API key is copied to clipboard
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4">
              <button
                type="button"
                onClick={handleResetToken}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Reset Token
              </button>

              <a
                href="https://www.postman.com/descent-module-architect-70215079/my-workspace/collection/iufb217/ananbay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                API documentations
              </a>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="flex justify-center items-center mt-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl"
          >
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                Họ và tên:
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Mật khẩu hiện tại:
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700">
                Mật khẩu mới:
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword")}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                >
                  {showNewPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Lưu
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Account;
