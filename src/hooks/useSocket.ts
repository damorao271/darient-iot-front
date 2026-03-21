import { useEffect, useRef } from 'react'
import { io, type Socket } from 'socket.io-client'

type SocketOptions = {
  url?: string
  onMessage?: (data: unknown) => void
  onConnect?: () => void
  onDisconnect?: () => void
}

export function useSocket({
  url,
  onMessage,
  onConnect,
  onDisconnect,
}: SocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null)
  const onMessageRef = useRef(onMessage)
  const onConnectRef = useRef(onConnect)
  const onDisconnectRef = useRef(onDisconnect)

  onMessageRef.current = onMessage
  onConnectRef.current = onConnect
  onDisconnectRef.current = onDisconnect

  useEffect(() => {
    const socketUrl = url ?? import.meta.env.VITE_WS_URL ?? 'http://localhost:3000'
    const socket = io(socketUrl)
    socketRef.current = socket

    socket.on('connect', () => onConnectRef.current?.())
    socket.on('disconnect', () => onDisconnectRef.current?.())
    socket.on('message', (data: unknown) => onMessageRef.current?.(data))

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [url])

  return { socket: socketRef.current }
}
