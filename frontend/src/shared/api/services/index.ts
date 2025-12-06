/**
 * API Services Layer
 *
 * Centralized, typed API service functions for all backend communication.
 * Services handle request/response transformation and error handling.
 *
 * Usage:
 * ```typescript
 * import { snapshotApi, userApi, sparingApi, gjeldApi } from '@/shared/api/services';
 *
 * const snapshots = await snapshotApi.getAll();
 * const user = await userApi.getMe();
 * const sparing = await sparingApi.getSummary();
 * const gjeld = await gjeldApi.getSummary();
 * ```
 */

export { snapshotApi, type SnapshotQueryOptions } from './snapshotApi';
export { userApi, type User } from './userApi';
export { sparingApi, type SparingResponse } from './sparingApi';
export { gjeldApi, type GjeldResponse } from './gjeldApi';
