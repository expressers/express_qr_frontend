import React from "react";
import {
  Button,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Spinner,
  Select,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
} from "../ui";

import { useEditQrcode } from "@/hooks";

interface EditGenerateProps {
  link: string;
  id: string;
  title?: string;
  children: React.ReactNode;
  type:"STATIC" | "DYNAMIC"
}

function EditGenerate({ link, id, children, title ,type}: EditGenerateProps) {
  const { form, onSubmit, isLoading } = useEditQrcode({
    link: `https://${link}`,
    id,
    title,
  });


  return (
    <React.Fragment>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col justify-between h-full">
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <div className="p-3.5 space-y-8">
                <Select defaultValue={type}>
                  <SelectTrigger className="w-full  py-6">
                    <SelectValue placeholder={type} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel></SelectLabel>
                      <SelectItem value="STATIC">Estatico</SelectItem>
                      <SelectItem value="DYNAMIC">Dinamico</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Titulo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Adiciona um titulo"}
                          defaultValue={title}
                          type="text"
                          className="py-6  text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">url</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Adiciona a url"}
                          defaultValue={link}
                          type="text"
                          className="py-6 text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <SheetFooter>
                <Button
                  variant="default"
                  className=" p-6 rounded-sm cursor-pointer"
                  type="submit">
                  {isLoading && <Spinner />}
                  Salvar
                </Button>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className=" p-6 rounded-sm cursor-pointer"
                    type="button">
                    Cancelar
                  </Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </React.Fragment>
  );
}

export { EditGenerate };
