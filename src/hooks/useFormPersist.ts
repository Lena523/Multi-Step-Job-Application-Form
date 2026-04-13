import { useEffect, useRef } from 'react'

import type { ApplicationFormData } from '../validation/applicationSchema'
import type { UseFormReturn } from 'react-hook-form'

const STORAGE_KEY = 'jobApplicationData'

export function useFormPersist(methods: UseFormReturn<ApplicationFormData>) {
    const { watch, reset } = methods
    const hasHydrated = useRef(false)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)

        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                reset(parsed)
            } catch (err) {
                console.error('Failed to parse stored form data:', err)
                localStorage.removeItem(STORAGE_KEY)
            }
        } else {
            reset()
        }

        hasHydrated.current = true
    }, [reset])

    useEffect(() => {
        const subscription = watch((values) => {
            if (!hasHydrated.current) return
            localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
        })

        return () => subscription.unsubscribe()
    }, [watch])
}
