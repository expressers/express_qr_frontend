import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Button,
  Spinner,
} from "@/components";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang, useResetPassword } from "@/hooks";

function ResetPassword() {
  const { form, onSubmit, isLoading, hasToken } = useResetPassword();
  const { translations } = useLang();
  const t = translations.pages.ResetPassword;
  

  return (
    <React.Fragment>
      <div
        className={`h-screen w-full  flex items-center justify-end  sm:p-4 bgImg`}>
        <div
          className=" dark:bg-black bg-white h-full lg:w-1/3 
        md:w-2/3 w-full rounded-md  sm:px-8 px-4 ">
          {!hasToken ? (
            <div className="h-full flex flex-col justify-center items-center gap-4 text-center">
              <span className="lg:text-2xl text-lg font-bold">{t.missingTokenTitle}</span>
              <p className="text-sm">{t.missingToken}</p>
              <Button asChild className="p-6">
                <Link to="/auth/forgotpassword">{t.requestNewLink}</Link>
              </Button>
              <Link to="/auth/signin" className="text-xs font-bold">
                {t.back}
              </Link>
            </div>
          ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="h-full lg:space-y-8  space-y-4 flex flex-col justify-center ">
              <div className="mb-6 flex flex-col">
                <span className="lg:text-2xl md:text-xl text-lg  text-center font-bold">
                  {t.title}
                </span>
                <p
                  className="text-xs font-medium mt-1  text-center"
                  dangerouslySetInnerHTML={{ __html: t.subtitle }}
                />
              </div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t.newPasswordPlaceholder}
                        type="password"
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
                name="confPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t.confirmNewPasswordPlaceholder}
                        type="password"
                        className="lg:py-6 md:py-4 py-2 text-xs"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="lg:p-6 md:p-6 p-2 cursor-pointer">
                {" "}
                {isLoading && <Spinner />}
                {t.button}
              </Button>

              <span className="text-center text-xs">
                <Link
                  to="/auth/signin"
                  className="font-bold text-xs flex items-center justify-center gap-2">
                  <span>
                    <ChevronLeft size={16} />
                  </span>
                  <span>{t.back}</span>
                </Link>
              </span>
            </form>
          </Form>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export { ResetPassword };
