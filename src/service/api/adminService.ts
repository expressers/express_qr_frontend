import apiClient from "./apiClient";
import type { ApiEnvelope } from "./qrCodeService";

export type ManagedPlan = "FREE" | "PRO" | "PREMIUM";
export type ManagedStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type PlanPeriodDays = 30 | 90 | 365;

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  /** Plano efectivo (FREE/PRO/PREMIUM/INTERNAL) ou `null` se o servidor não o enviar. */
  plan: string | null;
  /** Fim da subscrição em ISO, ou `null`. */
  planEndsAt: string | null;
}

export interface AdminUsersQuery {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface AdminUsersPage {
  users: AdminUser[];
  pagination: AdminPagination;
}

export interface AdminAuditLog {
  id: string;
  createdAt: string;
  actorEmail: string | null;
  actorRole: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
}

export interface AdminAuditPage {
  logs: AdminAuditLog[];
  pagination: AdminPagination;
}

type Raw = Record<string, unknown>;

const asString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value : null;

function asRecord(value: unknown): Raw | null {
  return value && typeof value === "object" ? (value as Raw) : null;
}

/**
 * O plano e o fim da subscrição podem vir no próprio utilizador ou aninhados
 * (`subscription`, `plan`); lê os formatos conhecidos e ignora o resto.
 */
function readPlan(raw: Raw): { plan: string | null; endsAt: string | null } {
  const subscription = asRecord(raw.subscription) ?? asRecord(raw.activeSubscription);
  const planObject = asRecord(raw.plan);
  const plan =
    asString(raw.plan) ??
    asString(raw.effectivePlan) ??
    asString(planObject?.effectivePlan) ??
    asString(planObject?.name) ??
    asString(subscription?.plan) ??
    asString(subscription?.planName);
  const endsAt =
    asString(raw.planEndsAt) ??
    asString(raw.currentPeriodEnd) ??
    asString(raw.subscriptionEndsAt) ??
    asString(subscription?.currentPeriodEnd);
  return { plan, endsAt };
}

function toAdminUser(raw: Raw): AdminUser {
  const { plan, endsAt } = readPlan(raw);
  const fullName = [asString(raw.firstName), asString(raw.lastName)].filter(Boolean).join(" ");
  return {
    id: String(raw.id ?? ""),
    email: asString(raw.email) ?? "",
    name: asString(raw.displayName) ?? fullName,
    role: asString(raw.role) ?? "USER",
    status: asString(raw.status) ?? "ACTIVE",
    plan,
    planEndsAt: endsAt,
  };
}

function toPagination(raw: unknown, fallbackLimit: number, count: number): AdminPagination {
  const p = asRecord(raw) ?? {};
  const limit = Number(p.limit) || fallbackLimit;
  const total = Number(p.total ?? count);
  return {
    page: Number(p.page) || 1,
    limit,
    total,
    totalPages: Number(p.totalPages) || Math.max(1, Math.ceil(total / limit)),
  };
}

function toAuditLog(raw: Raw): AdminAuditLog {
  return {
    id: String(raw.id ?? ""),
    createdAt: String(raw.createdAt ?? ""),
    actorEmail: asString(raw.actorEmail),
    actorRole: asString(raw.actorRole),
    action: asString(raw.action) ?? "",
    targetType: asString(raw.targetType),
    targetId: asString(raw.targetId),
  };
}

export const adminService = {
  async listUsers(query: AdminUsersQuery = {}): Promise<AdminUsersPage> {
    const limit = query.limit ?? 20;
    const response = await apiClient.get<ApiEnvelope<{ users?: Raw[]; pagination?: unknown }>>(
      "/api/admin/users",
      { ...query, limit },
    );
    const users = (response.data.data.users ?? []).map(toAdminUser);
    return { users, pagination: toPagination(response.data.data.pagination, limit, users.length) };
  },

  async changePlan(userId: string, data: { plan: ManagedPlan; periodDays?: PlanPeriodDays }) {
    const response = await apiClient.patch<ApiEnvelope<{ plan: string; currentPeriodEnd?: string | null }>>(
      `/api/admin/users/${encodeURIComponent(userId)}/plan`,
      { ...data },
    );
    return response.data.data;
  },

  async changeStatus(userId: string, status: ManagedStatus) {
    const response = await apiClient.patch<ApiEnvelope<{ userId: string; newStatus: string }>>(
      `/api/admin/users/${encodeURIComponent(userId)}/status`,
      { status },
    );
    return response.data.data;
  },

  async listAuditLogs(query: { page?: number; limit?: number } = {}): Promise<AdminAuditPage> {
    const limit = query.limit ?? 20;
    const response = await apiClient.get<ApiEnvelope<{ logs?: Raw[]; pagination?: unknown }>>(
      "/api/admin/audit-logs",
      { ...query, limit },
    );
    const logs = (response.data.data.logs ?? []).map(toAuditLog);
    return { logs, pagination: toPagination(response.data.data.pagination, limit, logs.length) };
  },
};
