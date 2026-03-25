import { Select } from './ui/Select'
import { Input } from './ui/Input'

const SORT_ORDER_OPTIONS: { value: 'asc' | 'desc'; label: string }[] = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
]

const PAGE_SIZE_OPTIONS = [10, 25, 50]

interface ReservationsTableFiltersProps {
  searchEmail: string
  searchEmailError?: string
  onSearchEmailChange: (value: string) => void
  sortOrder: 'asc' | 'desc'
  pageSize: number
  fromDate: string
  toDate: string
  dateRangeError?: string
  onSortOrderChange: (value: 'asc' | 'desc') => void
  onPageSizeChange: (value: number) => void
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  onSearch: () => void
  onClearFilters: () => void
}

export function ReservationsTableFilters({
  searchEmail,
  searchEmailError,
  onSearchEmailChange,
  sortOrder,
  pageSize,
  fromDate,
  toDate,
  dateRangeError,
  onSortOrderChange,
  onPageSizeChange,
  onFromDateChange,
  onToDateChange,
  onSearch,
  onClearFilters,
}: ReservationsTableFiltersProps) {
  return (
    <div className="mb-3 flex flex-wrap items-end gap-4 rounded-xl bg-sky-50/80 px-4 py-3">
      <div className="min-w-48">
        <Input
          label="SEARCH BY EMAIL"
          type="email"
          placeholder="user@example.com"
          value={searchEmail}
          onChange={(e) => onSearchEmailChange(e.target.value)}
          error={searchEmailError}
          className="border-slate-200 bg-white"
          data-cy="reservation-filter-email"
        />
      </div>
      <div className="min-w-36">
        <Input
          label="FROM DATE"
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="border-slate-200 bg-white"
          data-cy="reservation-filter-from"
        />
      </div>
      <div className="min-w-36">
        <Input
          label="TO DATE"
          type="date"
          value={toDate}
          min={fromDate}
          onChange={(e) => onToDateChange(e.target.value)}
          error={dateRangeError}
          className="border-slate-200 bg-white"
          data-cy="reservation-filter-to"
        />
      </div>
      <div className="min-w-32">
        <Select
          label="ORDER"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
          className="border-slate-200 bg-white"
        >
          {SORT_ORDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="min-w-24">
        <Select
          label="PER PAGE"
          value={String(pageSize)}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border-slate-200 bg-white"
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex items-end gap-2 ml-auto">
        <button
          type="button"
          data-cy="reservation-filter-search"
          onClick={onSearch}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors uppercase tracking-wide"
        >
          Search
        </button>
        <button
          type="button"
          data-cy="reservation-filter-clear"
          onClick={onClearFilters}
          className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors uppercase tracking-wide"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
