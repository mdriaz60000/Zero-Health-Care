
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = async ({ searchParams}: { searchParams: { redirect?: string } }) => {
  console.log(searchParams)
  const redirect = searchParams?.redirect;
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500">
            Enter your credentials to access your account
          </p>
        </div>
        <LoginForm redirect={redirect} />
      </div>
    </div>
  );
};

export default LoginPage;
