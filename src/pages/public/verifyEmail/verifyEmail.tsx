import { Button } from '@/components';

import { MailCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import {  useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from "@/service/api"
import { useLang } from '@/hooks';
function VerifyEmail() {

    const { translations } = useLang();
    const t = translations.pages.VerifyEmail;

     const [searchParams] = useSearchParams();
     const navigate = useNavigate();
     const [loading, setLoading] = useState(true);
     const [success, setSuccess] = useState(false);
     const [error, setError] = useState("");

     useEffect(() => {

       const verifyEmailToken = async () => {
         const token = searchParams.get("token");
         const errorParam = searchParams.get("error");
         const successParam = searchParams.get("success");
         const messageParam = searchParams.get("message");

         
         if (errorParam) {
           setError(
             decodeURIComponent(messageParam || t.invalidToken),
           );
           setLoading(false);
           return;
         }

         if (successParam === "true") {
           setSuccess(true);
           setLoading(false);

         
           setTimeout(() => {
             navigate("/auth/signin");
           }, 5000);
           return;
         }

         
         if (!token) {
           setError(t.tokenNotProvided);
           setLoading(false);
           return;
         }

         try {
           const response = await authService.verifyEmail(token);
           
           if (response.success) {
             setSuccess(true);
             
             setTimeout(() => {
               navigate("/auth/signin");
             }, 5000);
           } else {
             setError(response.message || t.verifyFailure);
           }
         } catch (error) {
             setError(t.verifyError);
             console.log(error)
         } finally {
           setLoading(false);
         }
       };

       verifyEmailToken();
     }, [searchParams, navigate, t]);

     const handleGoToLogin = () => {
       navigate("/auth/signin");
     };
    console.log(error)
  return (
    <React.Fragment>
      <div
        className={`h-screen w-full  flex items-center justify-center  p-2 bg-gray-800/10`}>
        <div className=" dark:bg-black bg-white flex flex-col gap-6 justify-center items-center  p-6   rounded-md">
          <span>
            {" "}
            <MailCheck size={30} />
          </span>

          {loading && (
            <>
              <h4 className="sm:text-2xl text-xl font-bold">
                {t.verifyingTitle}
              </h4>
              <div className="space-y-2">
                <p className="text-center text-sm"></p>
                <p className="block text-center  text-sm">
                  {t.verifyingSubtitle}
                </p>
              </div>
            </>
          )}
          {!loading && success ? (
            <>
              <h4 className="sm:text-2xl text-xl font-bold">
                {t.successTitle}
              </h4>
              <div className="space-y-2">
                <p className="text-center text-sm">{t.successDescription}</p>
                <p className="block text-center  text-sm"></p>
              </div>
              <Button
                variant="default"
                type="button"
                className="p-6"
                onClick={handleGoToLogin}>
                {t.buttonLogin}
              </Button>
            </>
          ) : (
            <div className=" flex flex-col items-center justify-center gap-6">
              <h4 className="sm:text-2xl text-xl font-bold">{t.verifyError}</h4>
              <div className="space-y-2">
                <p className="text-center text-sm">{t.errorDescription}</p>
                <p className="block text-center  text-sm"></p>
              </div>
              
                <Button
                  variant="default"
                  type="button"
                  className="p-6"
                  onClick={handleGoToLogin}>
                  <span>{t.errorDescription}</span>
                </Button>
              
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export {VerifyEmail}