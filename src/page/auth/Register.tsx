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
import { string, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePost } from "@/module/hooks/usePost";
import { toast } from "sonner";

const registerValidation = z.object({
  name: z.string().min(1, { message: "Name required" }),
  email: z.string().min(1, { message: "Email required" }),
  password: z
    .string({ required_error: "Password required" })
    .min(6, { message: "Min 6 character password" }),
});

type RegisterValidation = z.infer<typeof registerValidation>;

export function RegisterForm() {
  const form = useForm<RegisterValidation>({
    resolver: zodResolver(registerValidation),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const register = usePost('register', {method: 'json', success_code: 201})
  const navigator = useNavigate()

  const onSubmit = async (values: RegisterValidation) => {
    const res = await register.sendData(values);

    if (res.status)
    {
      toast.success(res.data.message);
      navigator('/');
    }
  };

  return (
    <div className="h-screen grid justify-center">
      <div className="place-content-center">
        <Card className="h-fit max-w-sm ">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>
              Enter your email below to register to your account.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="text-start">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button className="w-full">Register</Button>
                <small>
                  Already have a account?{" "}
                  <Link
                    to={"/"}
                    className="font-semibold text-blue-500 hover:underline"
                  >
                    Sign In here.
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
