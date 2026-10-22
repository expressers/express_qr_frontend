import { useState } from "react";
import { MoreHorizontal, Search as SearchIcon, TriangleAlert } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui";
import { Pager, RoleBadge, RowsSkeleton, UserStatusBadge } from "./adminShared";
import { PlanDialog } from "./planDialog";
import { StatusDialog, type StatusChange } from "./statusDialog";
import { useAdminQuery, useDebouncedValue, useFormatDate, useLang } from "@/hooks";
import { adminService, type AdminUser, type ManagedStatus } from "@/service/api";
import { getErrorMessage } from "@/utils";

const ALL = "ALL";
const ROLES = ["USER", "STAFF", "ADMIN"];
const STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"];
const MANAGED_STATUSES: ManagedStatus[] = ["ACTIVE", "INACTIVE", "SUSPENDED"];
const PAGE_SIZE = 20;

function UsersPanel() {
  const { translations } = useLang();
  const t = translations.pages.Admin;
  const formatDate = useFormatDate();
  const plans = t.plans as Record<string, string>;
  const statuses = t.statuses as Record<string, string>;

  const [search, setSearch] = useState("");
  const [role, setRole] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [page, setPage] = useState(1);
  const [planTarget, setPlanTarget] = useState<AdminUser | null>(null);
  const [statusChange, setStatusChange] = useState<StatusChange | null>(null);
  const debouncedSearch = useDebouncedValue(search.trim());

  const query = {
    search: debouncedSearch || undefined,
    role: role === ALL ? undefined : role,
    status: status === ALL ? undefined : status,
    page,
    limit: PAGE_SIZE,
  };
  const { data, error, isLoading, reload } = useAdminQuery(
    () => adminService.listUsers(query),
    JSON.stringify(query),
  );
  const users = data?.users ?? [];

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  function rowActions(user: AdminUser) {
    const isInternal = user.role !== "USER";
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t.users.actionsFor.replace("{email}", user.email)}>
            <MoreHorizontal aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-52">
          <DropdownMenuItem disabled={isInternal} onSelect={() => setPlanTarget(user)}>
            {t.users.changePlan}
          </DropdownMenuItem>
          {isInternal && (
            <p className="px-2 pb-1.5 text-xs text-muted-foreground">{t.users.internalPlan}</p>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {t.users.changeStatus}
          </DropdownMenuLabel>
          {MANAGED_STATUSES.map((next) => (
            <DropdownMenuItem
              key={next}
              disabled={user.status === next}
              onSelect={() => setStatusChange({ user, status: next })}>
              {statuses[next]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const planLabel = (user: AdminUser) => (user.plan ? (plans[user.plan] ?? user.plan) : "-");
  const endLabel = (user: AdminUser) => formatDate(user.planEndsAt) ?? t.common.noDate;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative min-w-0 flex-1 basis-60">
          <label htmlFor="admin-user-search" className="sr-only">
            {t.users.searchLabel}
          </label>
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="admin-user-search"
            type="search"
            value={search}
            onChange={(event) => resetPage(setSearch)(event.target.value)}
            placeholder={t.users.searchPlaceholder}
            autoComplete="off"
            className="pl-9"
          />
        </div>
        <FilterSelect
          label={t.users.roleFilter}
          allLabel={t.users.all}
          value={role}
          onChange={resetPage(setRole)}
          options={ROLES.map((value) => [value, (t.roles as Record<string, string>)[value]])}
        />
        <FilterSelect
          label={t.users.statusFilter}
          allLabel={t.users.all}
          value={status}
          onChange={resetPage(setStatus)}
          options={STATUSES.map((value) => [value, statuses[value]])}
        />
      </div>

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
      ) : users.length === 0 ? (
        <p className="rounded-lg border border-dashed border-input px-4 py-10 text-center text-sm text-muted-foreground">
          {t.users.empty}
        </p>
      ) : (
        <div aria-busy={isLoading} className={isLoading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="text-xs text-muted-foreground">
                  <TableHead scope="col" className="font-medium text-muted-foreground">{t.users.columns.user}</TableHead>
                  <TableHead scope="col" className="font-medium text-muted-foreground">{t.users.columns.role}</TableHead>
                  <TableHead scope="col" className="font-medium text-muted-foreground">{t.users.columns.status}</TableHead>
                  <TableHead scope="col" className="font-medium text-muted-foreground">{t.users.columns.plan}</TableHead>
                  <TableHead scope="col" className="font-medium text-muted-foreground">{t.users.columns.ends}</TableHead>
                  <TableHead scope="col" className="w-12">
                    <span className="sr-only">{t.users.columns.actions}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-b">
                    <TableCell className="max-w-72">
                      <p className="truncate font-medium" title={user.email}>{user.email}</p>
                      {user.name && <p className="truncate text-xs text-muted-foreground">{user.name}</p>}
                    </TableCell>
                    <TableCell><RoleBadge role={user.role} /></TableCell>
                    <TableCell><UserStatusBadge status={user.status} /></TableCell>
                    <TableCell>{planLabel(user)}</TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">{endLabel(user)}</TableCell>
                    <TableCell className="text-right">{rowActions(user)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <ul className="divide-y rounded-lg border md:hidden">
            {users.map((user) => (
              <li key={user.id} className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0 space-y-2">
                  <div>
                    <p className="truncate text-sm font-medium">{user.email}</p>
                    {user.name && <p className="truncate text-xs text-muted-foreground">{user.name}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <RoleBadge role={user.role} />
                    <UserStatusBadge status={user.status} />
                  </div>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {planLabel(user)} · {endLabel(user)}
                  </p>
                </div>
                {rowActions(user)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data && users.length > 0 && (
        <Pager pagination={data.pagination} count={users.length} isLoading={isLoading} onPage={setPage} />
      )}

      <PlanDialog
        key={planTarget?.id ?? "plan-none"}
        user={planTarget}
        onClose={() => setPlanTarget(null)}
        onDone={reload}
      />
      <StatusDialog change={statusChange} onClose={() => setStatusChange(null)} onDone={reload} />
    </div>
  );
}

function FilterSelect({
  label,
  allLabel,
  value,
  options,
  onChange,
}: {
  label: string;
  allLabel: string;
  value: string;
  options: string[][];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="block text-xs font-medium text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label} className="min-w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { UsersPanel };
