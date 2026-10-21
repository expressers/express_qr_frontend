import React from "react";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components";
import { Check } from "lucide-react";
import { useAccountype, useLang} from "@/hooks";

function Subscriber() {
  const { valueAccountype } = useAccountype();
  const { translations } = useLang();
 
 
  const t = translations.pages.Subscriber;

  const itemsPlan = [
    {
      ...t.plans.free,
      category: "basic",
    },
    {
      ...t.plans.ultimate,
      category: "popular",
    },
    {
      ...t.plans.teams,
      category: "company",
    },
  ];



  return (
    <React.Fragment>
      <div className="h-screen w-full">
        <div className="md:py-64 py-44 px-4 space-y-8">
          {/* Cabeçalho da página */}
          <div className="text-center space-y-4">
            <h4 className="md:text-3xl text-2xl font-bold">{t.title}</h4>
            <p
              className="md:text-sm text-xs"
              dangerouslySetInnerHTML={{ __html: t.description }}
            />
          </div>

          {/* Abas de planos */}
          <Tabs
            defaultValue="weekly"
            className="flex items-center justify-center space-y-8">
            <TabsList className="p-6">
              <TabsTrigger value="weekly" className="p-4">
                {t.tabs.weekly}
              </TabsTrigger>
              <TabsTrigger value="monthly" className="p-4">
                {t.tabs.monthly}
              </TabsTrigger>
              <TabsTrigger value="annual" className="p-4">
                {t.tabs.annual}
              </TabsTrigger>
            </TabsList>

            {/* Conteúdo das abas */}
            <TabsContent value="weekly">
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 items-center ">
                {itemsPlan.map((plan, index) => (
                  <div
                    key={index}
                    className={`${
                      plan.category === "popular"
                        ? "dark:bg-green-500 bg-green-400 px-1 pb-1 pt-3 rounded-xl space-y-4"
                        : ""
                    }`}>
                    {plan.category === "popular" && (
                      <div>
                        <span className="block text-sm font-bold text-center text-white">
                          {t.popular}
                        </span>
                      </div>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle>{plan.title}</CardTitle>
                        <CardDescription>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: plan.description,
                            }}
                          />
                        </CardDescription>
                        <CardAction />
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-7">
                          <div className="space-y-1">
                            <span className="font-bold text-2xl">
                              {plan.price}
                            </span>
                            <p className="text-xs">{plan.subText}</p>
                          </div>

                          <div className="space-y-3">
                            <Button
                              className="p-6 w-full"
                              variant={
                                valueAccountype === plan.title.toLowerCase()
                                  ? "outline"
                                  : "default"
                              }
                              disabled={
                                valueAccountype === plan.title.toLowerCase()
                              }>
                              {valueAccountype === plan.title.toLowerCase()
                                ? t.currentPlan
                                : t.continue}
                            </Button>
                            <p className="text-xs text-center">{plan.note}</p>
                          </div>

                          <Separator />
                        </div>
                      </CardContent>

                      <CardFooter>
                        <ul className="space-y-4">
                          {plan.features.map((item: string, i: number) => (
                            <li
                              key={i}
                              className="flex justify-start items-center gap-2">
                              <span
                                className={`${
                                  plan.category === "popular" &&
                                  "text-green-400"
                                }`}>
                                <Check size={14} />
                              </span>
                              <span
                                className="text-xs"
                                dangerouslySetInnerHTML={{
                                  __html: item,
                                }}/>
                                
                            </li>
                          ))}
                        </ul>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </React.Fragment>
  );
}

export { Subscriber };
