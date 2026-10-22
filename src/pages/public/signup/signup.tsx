import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
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
} from "@/components";

import { useLang, useSignUp } from "@/hooks";
import { Eye, EyeOff } from "lucide-react";

function SignUp() {
  const { form, onSubmit, isLoading } = useSignUp();
  const { translations } = useLang();
  const t = translations.pages.SignUp;
  const [isVisiblity, setIsVisible] = useState(false);

  return (
    <React.Fragment>
      <div className="h-screen w-full  flex items-center justify-start  sm:p-4 bgImg ">
        <div className="dark:bg-black bg-white h-full lg:w-1/3 md:w-2/3 w-full transition-all duration-300  md:rounded-md lg:px-8 md:px-6 px-4 sm:overflow-y-hidden sm:hover:overflow-y-scroll overflow-y-scroll custom-scroll  flex items-center justify-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" py-2 lg:space-y-4  space-y-3 flex flex-col justify-center w-full ">
              <div className="sm:mb-6  flex flex-col mt-12">
                <span className="lg:text-2xl md:text-xl text-lg lg:text-start md:text-start text-center font-bold p-1">
                  {t.title}
                </span>
                <p className="text-xs font-medium mt-1 lg:text-start md:text-start text-center ">
                  {t.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{t.firstName}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.firstNamePlaceholder}
                          type="text"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{t.lastName}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.lastNamePlaceholder}
                          type="text"
                          className="lg:py-6 md:py-4 py-2 text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t.email}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o seu Email"
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
                          type={isVisiblity ? "text" : "password"}
                          className="lg:py-6 md:py-4 py-2 text-xs w-full"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-4 md:top-4 top-2 "
                          onClick={() => setIsVisible((state) => !state)}>
                          {isVisiblity ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      {t.confirmPassword}
                    </FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          placeholder={t.passwordPlaceholder}
                          type={isVisiblity ? "text" : "password"}
                          className="lg:py-6 md:py-4 py-2 text-xs w-full"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-4 md:top-4 top-2 "
                          onClick={() => setIsVisible((state) => !state)}>
                          {isVisiblity ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="lg:p-6 md:p-6 p-2 cursor-pointer">
                {" "}
                {isLoading && <Spinner />}
                {t.button}
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
                variant="outline">
                <span className="mr-2">
                  <FcGoogle />
                </span>
                {t.continueGoogle}
              </Button>
              <span className="text-center text-xs mt-2">
                {t.haveAccount}{" "}
                <Link to="/auth/signin" className="font-bold text-xs">
                  {t.signinHere}
                </Link>
              </span>
            </form>
          </Form>
        </div>
      </div>
    </React.Fragment>
  );
}

export { SignUp };
