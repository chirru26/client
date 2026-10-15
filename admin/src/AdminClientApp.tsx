'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'

interface AdminClientAppProps { children?: ReactNode }

export default function AdminClientApp({ children }: AdminClientAppProps) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } } }))
  return <QueryClientProvider client={queryClient}><AdminLayout>{children}</AdminLayout></QueryClientProvider>
}
