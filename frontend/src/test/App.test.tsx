import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

const mockPointsTable = [
  {
    team: "Chennai Super Kings",
    matches: 7,
    won: 5,
    lost: 2,
    nrr: 0.771,
    for: "1130/133.1",
    against: "1071/138.5",
    points: 10
  },
  {
    team: "Royal Challengers Bangalore",
    matches: 7,
    won: 4,
    lost: 3,
    nrr: 0.597,
    for: "1217/140",
    against: "1066/131.4",
    points: 8
  },
  {
    team: "Rajasthan Royals",
    matches: 7,
    won: 3,
    lost: 4,
    nrr: 0.331,
    for: "1066/128.2",
    against: "1094/137.1",
    points: 6
  }
]

const mockCalculateResult = {
  textOutputs: [
    "If Rajasthan Royals score 120 runs in 20 overs, Rajasthan Royals need to restrict Royal Challengers Bangalore between 100 to 110 runs in 20 overs.",
    "Revised NRR of Rajasthan Royals will be between 0.350 to 0.450."
  ],
  structured: {
    minRuns: 100,
    maxRuns: 110,
    minNrr: 0.350,
    maxNrr: 0.450
  }
}

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock successful points table fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPointsTable)
    })
  })

  it('renders app title and main sections', async () => {
    render(<App />)
    
    expect(screen.getByText('IPL NRR Calculator')).toBeInTheDocument()
    expect(screen.getByText('Current Points Table')).toBeInTheDocument()
    expect(screen.getByText('NRR Calculator')).toBeInTheDocument()
    
    // Wait for points table to load
    await waitFor(() => {
      expect(screen.getByText('Chennai Super Kings')).toBeInTheDocument()
    })
  })

  it('displays points table correctly', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Chennai Super Kings')).toBeInTheDocument()
      expect(screen.getByText('Royal Challengers Bangalore')).toBeInTheDocument()
      expect(screen.getByText('Rajasthan Royals')).toBeInTheDocument()
    })

    // Check NRR formatting
    expect(screen.getByText('0.771')).toBeInTheDocument()
    expect(screen.getByText('0.597')).toBeInTheDocument()
  })

  it('handles form input changes', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByLabelText('Team')).toBeInTheDocument()
    })

    // Select team
    const teamSelect = screen.getByLabelText('Team')
    await user.selectOptions(teamSelect, 'Rajasthan Royals')
    expect(teamSelect).toHaveValue('Rajasthan Royals')

    // Select opponent  
    const opponentSelect = screen.getByLabelText('Opponent')
    await user.selectOptions(opponentSelect, 'Royal Challengers Bangalore')
    expect(opponentSelect).toHaveValue('Royal Challengers Bangalore')

    // Change overs
    const oversInput = screen.getByLabelText('Overs')
    await user.clear(oversInput)
    await user.type(oversInput, '15')
    expect(oversInput).toHaveValue(15)
  })

  it('shows conditional input fields based on toss result', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByLabelText('Toss Result')).toBeInTheDocument()
    })

    // Initially should show runs scored (Batting First is default)
    expect(screen.getByLabelText('Runs Scored')).toBeInTheDocument()
    expect(screen.queryByLabelText('Opponent Runs')).not.toBeInTheDocument()

    // Switch to Bowling First
    const tossSelect = screen.getByLabelText('Toss Result')
    await user.selectOptions(tossSelect, 'Bowling First')

    expect(screen.getByLabelText('Opponent Runs')).toBeInTheDocument()
    expect(screen.queryByLabelText('Runs Scored')).not.toBeInTheDocument()
  })

  it('validates form before submission', async () => {
    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Calculate NRR')).toBeInTheDocument()
    })

    const submitButton = screen.getByText('Calculate NRR')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please select both teams')).toBeInTheDocument()
    })
  })

  it('submits form and displays results', async () => {
    const user = userEvent.setup()
    
    // Mock the calculate NRR API call
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCalculateResult)
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByLabelText('Team')).toBeInTheDocument()
    })

    // Fill out form
    await user.selectOptions(screen.getByLabelText('Team'), 'Rajasthan Royals')
    await user.selectOptions(screen.getByLabelText('Opponent'), 'Royal Challengers Bangalore')
    await user.type(screen.getByLabelText('Runs Scored'), '120')

    // Submit form
    const submitButton = screen.getByText('Calculate NRR')
    await user.click(submitButton)

    // Check results are displayed
    await waitFor(() => {
      expect(screen.getByText(/If Rajasthan Royals score 120 runs in 20 overs/)).toBeInTheDocument()
      expect(screen.getByText(/Revised NRR of Rajasthan Royals will be between/)).toBeInTheDocument()
    })
  })

  it('displays error when API call fails', async () => {
    const user = userEvent.setup()
    
    // Mock failed API call
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByLabelText('Team')).toBeInTheDocument()
    })

    // Fill out form
    await user.selectOptions(screen.getByLabelText('Team'), 'Rajasthan Royals')
    await user.selectOptions(screen.getByLabelText('Opponent'), 'Royal Challengers Bangalore')
    await user.type(screen.getByLabelText('Runs Scored'), '120')

    // Submit form
    await user.click(screen.getByText('Calculate NRR'))

    await waitFor(() => {
      expect(screen.getByText('Failed to calculate NRR')).toBeInTheDocument()
    })
  })
})

