import React, { useState, useEffect } from 'react';
import { formatNRR } from './displayUtils';

interface PointsTableRow {
  team: string;
  matches: number;
  won: number;
  lost: number;
  nrr: number;
  for: string;
  against: string;
  points: number;
}

interface CalculateNRRDto {
  team: string;
  opponent: string;
  overs: number;
  desiredPosition: number;
  tossResult: 'Batting First' | 'Bowling First';
  runsScored?: number;
  opponentRuns?: number;
}

interface CalculateResult {
  textOutputs: string[];
  structured: {
    minRuns?: number;
    maxRuns?: number;
    minOvers?: string;
    maxOvers?: string;
    minNrr: number;
    maxNrr: number;
  };
}

const API_BASE = 'http://localhost:3000';

function App() {
  const [pointsTable, setPointsTable] = useState<PointsTableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CalculateResult | null>(null);
  const [error, setError] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<CalculateNRRDto>({
    team: '',
    opponent: '',
    overs: 20,
    desiredPosition: 1,
    tossResult: 'Batting First',
    runsScored: undefined,
    opponentRuns: undefined,
  });

  // Load points table on mount
  useEffect(() => {
    fetchPointsTable();
  }, []);

  const fetchPointsTable = async () => {
    try {
      const response = await fetch(`${API_BASE}/points-table`);
      if (!response.ok) throw new Error('Failed to fetch points table');
      const data = await response.json();
      setPointsTable(data);
    } catch (err) {
      setError('Failed to load points table');
      console.error(err);
    }
  };

  const handleInputChange = (field: keyof CalculateNRRDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Clear conditional fields when toss result changes
      ...(field === 'tossResult' ? { runsScored: undefined, opponentRuns: undefined } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Validate required fields
      if (!formData.team || !formData.opponent) {
        throw new Error('Please select both teams');
      }

      if (formData.team === formData.opponent) {
        throw new Error('Team and opponent must be different');
      }

      if (formData.tossResult === 'Batting First' && !formData.runsScored) {
        throw new Error('Runs scored is required when batting first');
      }

      if (formData.tossResult === 'Bowling First' && !formData.opponentRuns) {
        throw new Error('Opponent runs is required when bowling first');
      }

      const response = await fetch(`${API_BASE}/calculate-nrr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate NRR');
      }

      const result = await response.json();
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const teamOptions = pointsTable.map(row => row.team);

  return (
    <div className="container">
      <h1>IPL NRR Calculator</h1>

      {/* Points Table */}
      <div className="points-table">
        <h2>Current Points Table</h2>
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>Matches</th>
              <th>Won</th>
              <th>Lost</th>
              <th>Points</th>
              <th>For</th>
              <th>Against</th>
              <th>NRR</th>
            </tr>
          </thead>
          <tbody>
            {pointsTable.map((row, index) => (
              <tr key={row.team}>
                <td>{index + 1}. {row.team}</td>
                <td>{row.matches}</td>
                <td>{row.won}</td>
                <td>{row.lost}</td>
                <td>{row.points}</td>
                <td>{row.for}</td>
                <td>{row.against}</td>
                <td>{formatNRR(row.nrr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculator Form */}
      <div className="calculator">
        <h2>NRR Calculator</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="team">Team</label>
              <select
                id="team"
                value={formData.team}
                onChange={(e) => handleInputChange('team', e.target.value)}
                required
              >
                <option value="">Select Team</option>
                {teamOptions.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="opponent">Opponent</label>
              <select
                id="opponent"
                value={formData.opponent}
                onChange={(e) => handleInputChange('opponent', e.target.value)}
                required
              >
                <option value="">Select Opponent</option>
                {teamOptions.filter(team => team !== formData.team).map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="overs">Overs</label>
              <input
                id="overs"
                type="number"
                min="1"
                max="50"
                value={formData.overs}
                onChange={(e) => handleInputChange('overs', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="desiredPosition">Desired Position</label>
              <input
                id="desiredPosition"
                type="number"
                min="1"
                max="5"
                value={formData.desiredPosition}
                onChange={(e) => handleInputChange('desiredPosition', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tossResult">Toss Result</label>
              <select
                id="tossResult"
                value={formData.tossResult}
                onChange={(e) => handleInputChange('tossResult', e.target.value as 'Batting First' | 'Bowling First')}
                required
              >
                <option value="Batting First">Batting First</option>
                <option value="Bowling First">Bowling First</option>
              </select>
            </div>

            {formData.tossResult === 'Batting First' && (
              <div className="form-group">
                <label htmlFor="runsScored">Runs Scored</label>
                <input
                  id="runsScored"
                  type="number"
                  min="0"
                  value={formData.runsScored || ''}
                  onChange={(e) => handleInputChange('runsScored', parseInt(e.target.value) || undefined)}
                  required
                />
              </div>
            )}

            {formData.tossResult === 'Bowling First' && (
              <div className="form-group">
                <label htmlFor="opponentRuns">Opponent Runs</label>
                <input
                  id="opponentRuns"
                  type="number"
                  min="0"
                  value={formData.opponentRuns || ''}
                  onChange={(e) => handleInputChange('opponentRuns', parseInt(e.target.value) || undefined)}
                  required
                />
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate NRR'}
          </button>
        </form>

        {/* Results */}
        {error && (
          <div className="results error">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div className="results">
            <h3>Results</h3>
            {results.textOutputs.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
