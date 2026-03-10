import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { Hello } from '../components/Hello'

describe('Hello component', () => {
    it('renders the text "Hello World"', () => {
        render(<Hello />)
        expect(screen.getByText('Hello World')).toBeInTheDocument()
    })
})
