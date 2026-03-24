export const METRICS = [
  {
    key: 'tempC' as const,
    label: 'Temperature',
    unit: '°C',
    color: '#ef4444',
  },
  {
    key: 'humidityPct' as const,
    label: 'Humidity',
    unit: '%',
    color: '#3b82f6',
  },
  {
    key: 'co2Ppm' as const,
    label: 'CO₂',
    unit: 'ppm',
    color: '#f59e0b',
  },
  {
    key: 'occupancy' as const,
    label: 'Occupancy',
    unit: '',
    color: '#8b5cf6',
  },
  {
    key: 'powerW' as const,
    label: 'Power',
    unit: 'W',
    color: '#10b981',
  },
] as const
