/**
 * API Services Layer
 *
 * Centralized, typed API service functions for all backend communication.
 * Services handle request/response transformation and error handling.
 *
 * Usage:
 * ```typescript
 * import { snapshotApi, userApi } from '@/shared/api/services';
 *
 * const snapshots = await snapshotApi.getAll();
 * const user = await userApi.getMe();
 * ```
 */

export { snapshotApi, type SnapshotQueryOptions } from './snapshotApi';
export { userApi, type User } from './userApi';
