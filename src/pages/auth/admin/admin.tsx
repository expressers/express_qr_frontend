import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import { AuditPanel, UsersPanel } from "@/components/admin";
import { useLang } from "@/hooks";

/** Gestão mínima para a equipa: utilizadores (plano, estado) e auditoria. */
function Admin() {
  const { translations } = useLang();
  const t = translations.pages.Admin;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </header>

      <Tabs defaultValue="users" className="gap-6">
        <TabsList className="h-10 w-full sm:w-fit">
          <TabsTrigger value="users" className="sm:min-w-32">{t.tabs.users}</TabsTrigger>
          <TabsTrigger value="audit" className="sm:min-w-32">{t.tabs.audit}</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UsersPanel />
        </TabsContent>
        <TabsContent value="audit">
          <AuditPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { Admin };
