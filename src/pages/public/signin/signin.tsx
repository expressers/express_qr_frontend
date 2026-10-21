import React, {useState} from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Spinner,
  Toaster,
  Checkbox
} from "@/components";
import { FcGoogle } from "react-icons/fc";
import { Link} from "react-router-dom";
import { useLang, useSignIn, useSigninGoogle } from "@/hooks";
import {Eye, EyeOff} from "lucide-react"




function SignIn() {
  
  const { form, onSubmit, isLoading } = useSignIn();
  const { translations } = useLang();
  const t = translations.pages.SignIn;
  const { login } = useSigninGoogle();
  const [isVisiblity, setIsVisible] = useState(false)
  
  




  return (
    <React.Fragment>
      <Toaster richColors />
      <div
        className={`h-screen w-full  flex items-center justify-end  sm:p-4 bgImg`}
        
      >

       
        <div
          className=" dark:bg-black bg-white h-full lg:w-1/3 
        md:w-2/3 w-full md:rounded-md  sm:px-8 px-4 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="h-full lg:space-y-6  space-y-4 flex flex-col justify-center ">
              <div className="mb-6 flex flex-col">
                <span className="lg:text-2xl md:text-xl text-lg lg:text-start md:text-start text-center font-bold">
                  {t.welcome}
                </span>
                <p className="text-xs font-medium mt-1 lg:text-start md:text-start text-center">
                  {t.subtitle}
                </p>
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t.email}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.emailPlaceholder}
                        type="email"
                        className="lg:py-6 md:py-4 py-2 text-xs"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t.password}</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        
                      <Input
                        placeholder={t.passwordPlaceholder}
                        type={isVisiblity ?"text" : "password"}
                        className="lg:py-6 md:py-4 py-2 text-xs w-full"
                        {...field}
                        />
                        <button type="button" className="absolute right-4 md:top-4 top-2 " onClick={() => setIsVisible(state => !state)}>
                          {isVisiblity ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <div className="flex justify-center items-center gap-2">
                  <Checkbox />
                  <span className="text-xs">{t.rememberMe}</span>
                </div>
                <Link
                  to="/auth/forgotpassword"
                  className="text-xs hover:underline">
                  {t.forgotPassword}
                </Link>
              </div>
              <Button
                type="submit"
                className="lg:p-6 md:p-6 p-2 cursor-pointer">
                {" "}
                {isLoading && <Spinner />}
                {t.login}
              </Button>

              <div className="flex  items-center justify-center gap-4 mt-4">
                <span className=" w-[20%] h-[1px] bg-gray-500 block" />
                <span className=" text-center block text-xs">
                  {t.orContinue}{" "}
                </span>
                <span className="  w-[20%] h-[1px] bg-gray-500 block" />
              </div>
              <Button
                type="button"
                className="lg:p-6 md:p-6 p-2 cursor-pointer text-xs"
                variant="outline"
                onClick={() => login()}>
                <span className="mr-2">
                  <FcGoogle />
                </span>
                {t.continueGoogle}
              </Button>
              <span className="text-center text-xs mt-2">
                {t.noAccount}{" "}
                <Link to="/auth/signup" className="font-bold text-xs">
                  {t.signupHere}
                </Link>
              </span>
            </form>
          </Form>
        </div>
      </div>
    </React.Fragment>
  );
}

export { SignIn };
