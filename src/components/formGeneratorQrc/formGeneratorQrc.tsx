import { useGenerateQr, useLang } from "@/hooks";
import React, { useEffect } from "react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "../ui";
import { QrCodeGenerated } from "../qrCodeGenerated";
import { useModalDialog } from "@/hooks";

function FormGeneratorQrc() {
  const { isLoading, register, errors, handleSubmit, onSubmit, data } =
    useGenerateQr();
  const { isVisibleDialogSaveImg, setIsVisibleDialogSaveImg } =
    useModalDialog();

  const { translations } = useLang();
  const t = translations.components.FormGeneratorQrc;
  useEffect(() => {
    if (data) {
      setIsVisibleDialogSaveImg(true);
    }
  }, [data, setIsVisibleDialogSaveImg]);

 

  return (
    <React.Fragment>
      {data && (
        <QrCodeGenerated
          id={data.id}
          isOpen={isVisibleDialogSaveImg}
          setIsOpen={setIsVisibleDialogSaveImg}
          qrcode={data.imageUrl}
        />
      )}

      <div className="lg:w-[34%] rounded-lg overflow-hidden sm:px-6 px-4 py-4 relative after:content-[''] after:absolute after:inset-0 dark:bg-transparent bg-white after:backdrop-blur-2xl after:dark:bg-zinc-800  after:-z-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="flex items-center justify-center gap-4 lg:flex-row md:flex-row sm:flex-row flex-col">
              <Input
                autoFocus={true}
                placeholder={t.placeholder}
                {...register("url")}
                className="py-6 text-xs  "
              />
            </div>
            {errors?.url && (
              <div className="py-1">
                <span className="text-xs text-red-400 font-semibold">
                  {errors.url.message}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Select defaultValue="link">
              <SelectTrigger className="sm:w-full w-[180px]  py-6">
                <SelectValue placeholder="Link" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t.typesLabel}</SelectLabel>
                  <SelectItem value="link">Link</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              className="rounded py-6 sm:w-auto"
              disabled={isLoading}
              variant="default">
              {isLoading && <Spinner />}
              {t.button}
            </Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}

export { FormGeneratorQrc };
