export const queryKeys = {
  spaces: {
    detail: (spaceId: string) => ['spaces', 'detail', spaceId] as const,
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
