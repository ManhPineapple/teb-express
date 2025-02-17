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
        toast.success("Successfully");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Error ");
    }
  };

  return (
    <>
      <PageHead title="Signup | Ananbay" />
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
              <h2 className="mb-6 text-center text-2xl">Sign up</h2>

              <div className="mb-4">
                <label className="mb-1 block">Full name:</label>
                <input
                  {...register("full_name")}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Nhập tên tài khoản"
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-1 block">Package:</label>
                <select
                  {...register("package")}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="">Select package</option>
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
                <label className="mb-1 block">Phone number:</label>
                <input
                  {...register("phone_number")}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Nhập số điện thoại của bạn"
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
                  placeholder="Nhập email của bạn"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-4 relative">
                <label className="mb-1 block">Password:</label>
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
                Sign up
              </button>
              <div className="mt-5">
                Do you already have an account?
                <a href="/login" className="text-[#8d181b] ml-2">
                  Login
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
              Your request has been sent
            </div>
            <p className="text-center thank_use_sevice">
              Thank you for using Ananbay's services. We'll contact you soon to
              set up your account.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
