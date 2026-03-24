export interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  subValue?: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'amber' | 'violet' | 'rose' | 'slate'
}
