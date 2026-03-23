export const queryKeys = {
  places: {
    all: ['places'] as const,
    list: (page?: number, limit?: number) =>
      [...queryKeys.places.all, 'list', page, limit] as const,
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
