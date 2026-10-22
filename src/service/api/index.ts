export { default as apiClient, type BlobDownload } from "./apiClient";
export { parseContentDispositionFilename } from "./contentDisposition";
export { ApiError, isApiError } from "./apiError";

export {
  userService,
  type GetUserMe,
  type UserMe,
  type UpdateProfileInput,
} from "./userService";
export { authService } from "./authService";
export {
  plansManagementService,
  type Plan,
  type PlanName,
  type PlanFeatures,
  type PlanUsage,
  type MyPlan,
  type Subscription,
} from "./plansManagementService";
export {
  qrCodeService,
  type ApiEnvelope,
  type QrCode,
  type QrCodeList,
  type QrType,
  type QrFormat,
  type QrDesign,
  type CreateQrCodeInput,
  type UpdateQrCodeInput,
  type PublicStaticQr,
} from "./qrCodeService";
export {
  analyticsService,
  type MyStats,
  type QrCodeStats,
  type DailyPoint,
  type FieldCount,
  type AnalyticsBreakdown,
} from "./analyticsService";
export {
  adminService,
  type AdminUser,
  type AdminUsersPage,
  type AdminUsersQuery,
  type AdminAuditLog,
  type AdminAuditPage,
  type AdminPagination,
  type ManagedPlan,
  type ManagedStatus,
  type PlanPeriodDays,
} from "./adminService";
