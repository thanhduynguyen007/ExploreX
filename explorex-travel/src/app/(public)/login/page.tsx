import { LoginForm } from "@/components/forms/login-form";
import { PageHero } from "@/components/ui/page-hero";

export default function LoginPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <PageHero
        eyebrow="Auth"
        title="Đăng nhập bằng JWT"
        description="Bản scaffold hiện tại dùng JWT trong cookie httpOnly, middleware chặn khu vực theo role và hỗ trợ tài khoản demo để test luồng điều hướng."
      />
      <LoginForm />
    </div>
  );
}
