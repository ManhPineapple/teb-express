import PageHead from "@/components/shared/page-head";
import { OPTIONS_PACKAGES } from "@/constants/auth";
import { userService } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().min(1, "Tên tài khoản là bắt buộc"),
  package: z.string().min(1, "Quy mô vận chuyển là bắt buộc"),
  phone_number: z
    .string()
    .min(10, "Số điện thoại không hợp lệ")
    .max(11, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type FormData = z.infer<typeof schema>;

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [shouldShowPassword, setShouldShowPassword] = useState<boolean>(false);

  const onSubmit = async (values: FormData) => {
    // @ts-expect-error no-error
    values.package = Number(values.package);

    try {
      const res = await userService.signup(values);
      if (res.errors && res.errors.length) {
        toast.error(res.errors[0]);
      } else {
        setIsSuccess(true);
        toast.success("Đăng ký thành công");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    }
  };

  return (
    <>
      <PageHead title="Đăng ký | Ananbay" />
      {!isSuccess && (
        <div className="">
          <div>
            <img
              src="../../../../logo.png"
              className="max-w-xs mx-auto mt-[100px]"
            />
          </div>

          <div className="flex items-center justify-center">
            <form
              className="lg:w-1/3 rounded-2xl bg-white p-8 shadow-md shadow-[#8d181b]"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h2 className="mb-6 text-center text-2xl">Đăng ký</h2>

              <div className="mb-4">
                <label className="mb-1 block">Họ và tên:</label>
                <input
                  {...register("full_name")}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Nhập họ và tên"
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-1 block">Gói dịch vụ:</label>
                <select
                  {...register("package")}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="">Chọn gói dịch vụ</option>
                  {OPTIONS_PACKAGES.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                {errors.package && (
                  <p className="text-sm text-red-500">
                    {errors.package.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-1 block">Số điện thoại:</label>
                <input
                  {...register("phone_number")}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone_number && (
                  <p className="text-sm text-red-500">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-1 block">Email:</label>
                <input
                  {...register("email")}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Nhập email"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-4 relative">
                <label className="mb-1 block">Mật khẩu:</label>
                <input
                  type={shouldShowPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Nhập mật khẩu"
                />
                <EyeIcon
                  onClick={() => setShouldShowPassword((prev) => !prev)}
                  className="absolute right-0 top-[30px] h-[38px] w-[38px] px-2"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-black py-3 text-white hover:bg-[#8d181b] font-bold"
              >
                Đăng ký
              </button>
              <div className="mt-5">
                Bạn đã có tài khoản?
                <a href="/login" className="text-[#8d181b] ml-2">
                  Đăng nhập
                </a>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="request-complete flex flex-col">
          <div className="text-center request-icon mx-auto mt-[200px]">
            <svg
              width="84"
              height="84"
              viewBox="0 0 84 84"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M42 77C61.25 77 77 61.25 77 42C77 22.75 61.25 7 42 7C22.75 7 7 22.75 7 42C7 61.25 22.75 77 42 77Z"
                stroke="#008A7F"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M27.125 42L37.03 51.905L56.875 32.095"
                stroke="#008A7F"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div className="request-content">
            <div className="text-center text-[#008A7F] font-bold">
              Yêu cầu của bạn đã được gửi
            </div>
            <p className="text-center thank_use_sevice">
              Cảm ơn bạn đã sử dụng dịch vụ của Ananbay. Chúng tôi sẽ liên hệ với
              bạn sớm để thiết lập tài khoản.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
