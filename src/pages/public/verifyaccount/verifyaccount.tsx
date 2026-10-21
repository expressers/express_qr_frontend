
import React from 'react'
import { MailCheck } from "lucide-react";

import { useLang } from '@/hooks';

function Verifyaccount() {
  const { translations } = useLang();
  const t = translations.pages.Verifyaccount;
  return (
    <React.Fragment>
      <div
        className={`h-screen w-full  flex items-center justify-center  p-2 bg-gray-800/10`}>
        <div className=" dark:bg-black bg-white flex flex-col gap-6 justify-center items-center  px-6 py-10 lg:w-1/3 md:w-1/2 sm:w-2/3  rounded-md">
          <span> <MailCheck size={30}/></span>
          <h4 className='sm:text-2xl text-xl font-bold'>{ t.title}</h4>
          <div className='space-y-2'>
            <p className="text-center text-sm">
             { t.subtitle}
            </p>
            <p className="block text-center  text-sm">
              { t.description}
            </p>
          </div>
        
        </div>
      </div>
    </React.Fragment>
  );
}

export {Verifyaccount}