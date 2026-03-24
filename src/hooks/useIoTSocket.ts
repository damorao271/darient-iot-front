import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io, type Socket } from 'socket.io-client'
import { queryKeys } from '../api/query-keys'
import type { TelemetryReading, TelemetryResponse, Alert } from '../types/iot.types'

interface IoTSocketCallbacks {
  onTelemetry?: (reading: TelemetryReading) => void
  onAlertOpened?: (alert: Alert) => void
  onAlertResolved?: (alert: Alert) => void
  onReported?: () => void
  onConnectionChange?: (connected: boolean) => void
}

export function useIoTSocket(
  spaceId: string | undefined,
  callbacks?: IoTSocketCallbacks,
) {
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const cbRef = useRef(callbacks)
  cbRef.current = callbacks

  useEffect(() => {
    if (!spaceId) return

    const socketUrl =
      import.meta.env.VITE_WS_URL ?? 'http://localhost:3000'
    const socket = io(socketUrl)
    socketRef.current = socket

    socket.on('connect', () => {
      cbRef.current?.onConnectionChange?.(true)
    })

    socket.on('disconnect', () => {
      cbRef.current?.onConnectionChange?.(false)
    })

    socket.on(
      'telemetry',
      (payload: { spaceId: string; data: TelemetryReading }) => {
        if (payload.spaceId !== spaceId) return

        queryClient.setQueryData<TelemetryResponse>(
          queryKeys.iot.telemetry(spaceId),
          (old) => {
            if (!old) return old
            const readings = [payload.data, ...old.readings].slice(0, 100)
            return { ...old, readings }
          },
        )

        cbRef.current?.onTelemetry?.(payload.data)
      },
    )

    socket.on(
      'alert:opened',
      (payload: { spaceId: string; alert: Alert }) => {
        if (payload.spaceId !== spaceId) return
        queryClient.invalidateQueries({
          queryKey: queryKeys.iot.alerts(spaceId),
        })
        cbRef.current?.onAlertOpened?.(payload.alert)
      },
    )

    socket.on(
      'alert:resolved',
      (payload: { spaceId: string; alert: Alert }) => {
        if (payload.spaceId !== spaceId) return
        queryClient.invalidateQueries({
          queryKey: queryKeys.iot.alerts(spaceId),
        })
        cbRef.current?.onAlertResolved?.(payload.alert)
      },
    )

    socket.on(
      'reported',
      (payload: { spaceId: string; reported: unknown }) => {
        if (payload.spaceId !== spaceId) return
        queryClient.invalidateQueries({
          queryKey: queryKeys.iot.device(spaceId),
        })
        cbRef.current?.onReported?.()
      },
    )

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [spaceId, queryClient])

  return { socket: socketRef.current }
}
