import { useState } from "react";
import { TriangleAlert } from "lucide-react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui";
import { Pager, RowsSkeleton } from "./adminShared";
import { useAdminQuery, useFormatDate, useLang } from "@/hooks";
import { adminService, type AdminAuditLog } from "@/service/api";
import { getErrorMessage } from "@/utils";

const PAGE_SIZE = 20;

/** Id curto para a lista: os 8 primeiros caracteres chegam para distinguir alvos. */
const shortId = (id: string | null) => (id ? id.slice(0, 8) : null);

function AuditPanel() {
  const { translations } = useLang();
  const t = translations.pages.Admin;
  const formatDate = useFormatDate();
  const [page, setPage] = useState(1);
  const { data, error, isLoading, reload } = useAdminQuery(
    () => adminService.listAuditLogs({ page, limit: PAGE_SIZE }),
    String(page),
  );
  const logs = data?.logs ?? [];

  const actor = (log: AdminAuditLog) => log.actorEmail ?? t.audit.system;
  const target = (log: AdminAuditLog) =>
    [log.targetType, shortId(log.targetId)].filter(Boolean).join(" ") || "-";

  return (
    <div className="space-y-4">
      {error && !data ? (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-destructive p-4 text-sm">
          <TriangleAlert className="size-4 shrink-0 text-destructive" aria-hidden />
          <span className="font-medium text-destructive">
            {getErrorMessage(error, translations.errors, t.common.loadError)}
          </span>
          <Button type="button" variant="outline" size="sm" onClick={reload}>
            {t.common.retry}
          </Button>
        </div>
      ) : isLoading && !data ? (
        <RowsSkeleton />
      ) : logs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-input px-4 py-10 text-center text-sm text-muted-foreground">
          {t.audit.empty}
        </p>
      ) : (
        <div aria-busy={isLoading} className={isLoading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col" className="font-medium text-muted-foreground">{t.audit.columns.when}</TableHead>
                  <TableHead scope="col" className="font-medium text-muted-foreground">{t.audit.columns.actor}</TableHead>
                  <TableHead scope="col" className="font-medium text-muted-foreground">{t.audit.columns.action}</TableHead>
                  <TableHead scope="col" className="font-medium text-muted-foreground">{t.audit.columns.target}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="border-b">
                    <TableCell className="text-muted-foreground tabular-nums">
                      {formatDate(log.createdAt, true) ?? "-"}
                    </TableCell>
                    <TableCell className="max-w-64 truncate" title={actor(log)}>{actor(log)}</TableCell>
                    <TableCell className="font-mono text-xs">{log.action}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{target(log)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <ul className="divide-y rounded-lg border md:hidden">
            {logs.map((log) => (
              <li key={log.id} className="space-y-1 p-3 text-sm">
                <p className="font-mono text-xs font-medium">{log.action}</p>
                <p className="truncate text-muted-foreground">{actor(log)}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatDate(log.createdAt, true) ?? "-"} · <span className="font-mono">{target(log)}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data && logs.length > 0 && (
        <Pager pagination={data.pagination} count={logs.length} isLoading={isLoading} onPage={setPage} />
      )}
    </div>
  );
}

export { AuditPanel };
