export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  spaces: {
    detail: (spaceId: string) => ['spaces', 'detail', spaceId] as const,
  },
  iot: {
    telemetry: (spaceId: string) => ['iot', 'telemetry', spaceId] as const,
    alerts: (spaceId: string, status?: string) =>
      ['iot', 'alerts', spaceId, status] as const,
    device: (spaceId: string) => ['iot', 'device', spaceId] as const,
  },
  reservations: {
    list: (
      spaceId?: string,
      page?: number,
      pageSize?: number,
      sortBy?: string,
      sortOrder?: string,
      fromDate?: string,
      toDate?: string,
      clientEmail?: string,
      searchTrigger?: number,
    ) =>
      [
        'reservations',
        'list',
        spaceId,
        page,
        pageSize,
        sortBy,
        sortOrder,
        fromDate,
        toDate,
        clientEmail,
        searchTrigger,
      ] as const,
  },
  places: {
    all: ['places'] as const,
    list: (page?: number, limit?: number) =>
      [...queryKeys.places.all, 'list', page, limit] as const,
    /** Base key for spaces - use for invalidation to match all pagination/sort variants */
    spacesAll: (placeId: string) =>
      [...queryKeys.places.all, 'spaces', placeId] as const,
    spaces: (
      placeId: string,
      page?: number,
      pageSize?: number,
      sortBy?: string,
      sortOrder?: string,
    ) =>
      [
        ...queryKeys.places.all,
        'spaces',
        placeId,
        page,
        pageSize,
        sortBy,
        sortOrder,
      ] as const,
  },
}
