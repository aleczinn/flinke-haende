'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { BASE_URL } from '@/lib/site'
import React from 'react'

export const LivePreviewListener: React.FC = () => {
    const router = useRouter()
    return <RefreshRouteOnSave refresh={router.refresh} serverURL={BASE_URL} />
}
