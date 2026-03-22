export const queryKeys = {
  places: {
    all: ['places'] as const,
    list: (page?: number, limit?: number) =>
      [...queryKeys.places.all, 'list', page, limit] as const,
  },
}
