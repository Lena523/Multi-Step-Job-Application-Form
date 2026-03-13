import { renderHook } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useFormPersist } from '../hooks/useFormPersist'

import type { ApplicationFormData } from '../validation/applicationSchema'

const STORAGE_KEY = 'jobApplicationData'

const validFormData: ApplicationFormData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '123456',
    city: 'Warsaw',
    jobTitle: 'Engineer',
    companyName: 'Acme',
    yearsOfExperience: 3,
    highestDegree: 'Bachelor',
}

function renderUseFormPersist() {
    return renderHook(() => {
        const methods = useForm<ApplicationFormData>()
        useFormPersist(methods)
        return methods
    })
}

describe('useFormPersist', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('restoring from localStorage on mount', () => {
        it('calls reset with parsed data when valid JSON exists in localStorage', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(validFormData))

            const { result } = renderUseFormPersist()

            expect(result.current.getValues()).toMatchObject(validFormData)
        })

        it('does not call reset when localStorage is empty', () => {
            const { result } = renderUseFormPersist()

            const values = result.current.getValues()
            expect(values.name).toBeFalsy()
            expect(values.email).toBeFalsy()
        })

        it('does not throw when localStorage is empty', () => {
            expect(() => renderUseFormPersist()).not.toThrow()
        })
    })

    describe('persisting form values to localStorage on change', () => {
        it('writes form values to localStorage when a field changes', async () => {
            const { result } = renderUseFormPersist()

            await result.current.setValue('name', 'John')

            const stored = localStorage.getItem(STORAGE_KEY)
            expect(stored).not.toBeNull()
            const parsed = JSON.parse(stored!)
            expect(parsed.name).toBe('John')
        })

        it('updates localStorage on each field change', async () => {
            const { result } = renderUseFormPersist()

            await result.current.setValue('name', 'First')
            const first = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
            expect(first.name).toBe('First')

            await result.current.setValue('name', 'Second')
            const second = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
            expect(second.name).toBe('Second')
        })
    })

    describe('handling corrupt localStorage data', () => {
        it('logs an error when stored data is invalid JSON', () => {
            localStorage.setItem(STORAGE_KEY, '{invalid json}')

            renderUseFormPersist()

            expect(console.error).toHaveBeenCalledWith(
                'Failed to parse stored form data:',
                expect.any(Error)
            )
        })

        it('removes the corrupt entry from localStorage after a parse failure', () => {
            localStorage.setItem(STORAGE_KEY, '{invalid json}')

            renderUseFormPersist()

            expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
        })

        it('does not call reset when stored data is invalid JSON', () => {
            localStorage.setItem(STORAGE_KEY, '{invalid json}')

            const { result } = renderUseFormPersist()

            const values = result.current.getValues()
            expect(values.name).toBeFalsy()
        })
    })

    describe('cleanup on unmount', () => {
        it('unsubscribes the watch subscription when the component unmounts', async () => {
            const { result, unmount } = renderUseFormPersist()

            unmount()

            localStorage.clear()
            await result.current.setValue('name', 'Ghost')

            expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
        })
    })
})
