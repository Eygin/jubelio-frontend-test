import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePost } from "@/module/hooks/usePost";
import Cookies from "js-cookie";

const loginValidation = z.object({
  email: z.string().min(1, { message: "Email required" }),
  password: z
    .string({ required_error: "Password required" })
    .min(6, { message: "Min 6 character password" }),
});

type LoginValidation = z.infer<typeof loginValidation>;

export function LoginForm() {
  const form = useForm<LoginValidation>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const login = usePost<{token:string}>('login', {method: 'json', success_code: 200})
  const navigate = useNavigate()

  const onSubmit = async (values: LoginValidation) => {
    const res = await login.sendData(values)

    if (res.status)
    {
      Cookies.set('token', JSON.stringify(res.data) || '')
      navigate('/products')
    }
  };

  return (
    <div className="h-screen grid justify-center">
      <div className="place-content-center">
        <Card className="h-fit max-w-sm ">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="text-start">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="text-start">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button className="w-full">Sign in</Button>
                <small>
                  Don't have a account?{" "}
                  <Link
                    to={"/register"}
                    className="font-semibold text-blue-500 hover:underline"
                  >
                    Register here.
                  </Link>
                </small>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
