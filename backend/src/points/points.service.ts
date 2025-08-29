import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CalculateNRRDto } from './dto/calculate-nrr.dto';

// 🏏 Cricket Data Types
export interface PointsTableRow {
  team: string;
  matches: number;
  won: number;
  lost: number;
  nrr: number;
  for: string;
  against: string;
  points: number;
}

export interface CalculateResult {
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

@Injectable()
export class PointsService {
  private pointsTable: PointsTableRow[];

  constructor() {
    this.loadPointsTable();
  }

  private loadPointsTable() {
    const filePath = join(__dirname, '..', '..', 'src', 'data', 'pointsTable.json');
    const fileData = readFileSync(filePath, 'utf-8');
    this.pointsTable = JSON.parse(fileData);
  }

  getPointsTable(): PointsTableRow[] {
    return [...this.pointsTable].sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;
      return b.nrr - a.nrr;
    });
  }

  // 🏏 PLUG-AND-PLAY NRR CALCULATOR
  calculateNRR(dto: CalculateNRRDto): CalculateResult {
    const { team, opponent, overs, desiredPosition, tossResult, runsScored, opponentRuns } = dto;
    
    if (tossResult === 'Batting First') {
      return this.battingFirstLogic(team, opponent, overs, desiredPosition, runsScored);
    } else {
      return this.bowlingFirstLogic(team, opponent, overs, desiredPosition, opponentRuns);
    }
  }

  // Simple batting first logic
  private battingFirstLogic(team: string, opponent: string, overs: number, position: number, runs: number): CalculateResult {
    const minRuns = Math.floor(runs * 0.4);
    const maxRuns = runs - 1;
    let validRuns = [];

    // Test each possible opponent score
    for (let oppRuns = minRuns; oppRuns <= maxRuns; oppRuns++) {
      const newNRR = this.calculateNewNRR(team, runs, overs * 6, oppRuns, overs * 6);
      const newPosition = this.getNewPosition(team, newNRR);
      
      if (newPosition === position) {
        validRuns.push(oppRuns);
      }
    }

    if (validRuns.length === 0) {
      return { textOutputs: [`${team} cannot reach position ${position}`], structured: { minNrr: 0, maxNrr: 0 } };
    }

    const minOpponentRuns = Math.min(...validRuns);
    const maxOpponentRuns = Math.max(...validRuns);
    const minNRR = this.calculateNewNRR(team, runs, overs * 6, maxOpponentRuns, overs * 6);
    const maxNRR = this.calculateNewNRR(team, runs, overs * 6, minOpponentRuns, overs * 6);

    return {
      textOutputs: [
        `If ${team} score ${runs} runs in ${overs} overs, ${team} need to restrict ${opponent} between ${minOpponentRuns} to ${maxOpponentRuns} runs in ${overs} overs.`,
        `Revised NRR of ${team} will be between ${minNRR.toFixed(2)} to ${maxNRR.toFixed(2)}.`
      ],
      structured: { minRuns: minOpponentRuns, maxRuns: maxOpponentRuns, minNrr: minNRR, maxNrr: maxNRR }
    };
  }

  // Simple bowling first logic
  private bowlingFirstLogic(team: string, opponent: string, overs: number, position: number, oppRuns: number): CalculateResult {
    const target = oppRuns + 1;
    const totalBalls = overs * 6;
    const minBalls = Math.floor(totalBalls * 0.6);
    const maxBalls = Math.floor(totalBalls * 0.95);
    let validBalls = [];

    // Test each possible chase timing
    for (let balls = minBalls; balls <= maxBalls; balls++) {
      const newNRR = this.calculateNewNRR(team, target, balls, oppRuns, totalBalls);
      const newPosition = this.getNewPosition(team, newNRR);
      
      if (newPosition === position) {
        validBalls.push(balls);
      }
    }

    if (validBalls.length === 0) {
      return { textOutputs: [`${team} cannot reach position ${position} by chasing ${target}`], structured: { minNrr: 0, maxNrr: 0 } };
    }

    const quickestBalls = Math.min(...validBalls);
    const slowestBalls = Math.max(...validBalls);
    const minNRR = this.calculateNewNRR(team, target, slowestBalls, oppRuns, totalBalls);
    const maxNRR = this.calculateNewNRR(team, target, quickestBalls, oppRuns, totalBalls);
    const quickOvers = this.ballsToOvers(quickestBalls);
    const slowOvers = this.ballsToOvers(slowestBalls);

    return {
      textOutputs: [
        `${team} need to chase ${target} between ${quickOvers} and ${slowOvers} overs.`,
        `Revised NRR for ${team} will be between ${minNRR.toFixed(2)} to ${maxNRR.toFixed(2)}.`
      ],
      structured: { minOvers: quickOvers, maxOvers: slowOvers, minNrr: minNRR, maxNrr: maxNRR }
    };
  }

  // Calculate what team's new NRR would be after a match
  private calculateNewNRR(teamName: string, teamRuns: number, teamBalls: number, oppRuns: number, oppBalls: number): number {
    const team = this.pointsTable.find(t => t.team === teamName);
    const currentFor = this.parseStats(team.for);
    const currentAgainst = this.parseStats(team.against);
    
    const newForRuns = currentFor.runs + teamRuns;
    const newForBalls = currentFor.balls + teamBalls;
    const newAgainstRuns = currentAgainst.runs + oppRuns;
    const newAgainstBalls = currentAgainst.balls + oppBalls;
    
    const forRate = newForBalls > 0 ? newForRuns / (newForBalls / 6) : 0;
    const againstRate = newAgainstBalls > 0 ? newAgainstRuns / (newAgainstBalls / 6) : 0;
    
    return forRate - againstRate;
  }

  // Find what position team would be in with new NRR
  private getNewPosition(teamName: string, newNRR: number): number {
    const team = this.pointsTable.find(t => t.team === teamName);
    const newPoints = team.points + 2; // Assuming they win
    
    const simulatedTable = this.pointsTable.map(t => {
      if (t.team === teamName) {
        return { ...t, points: newPoints, nrr: newNRR };
      }
      return { ...t };
    });
    
    const sortedTable = simulatedTable.sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;
      return b.nrr - a.nrr;
    });
    
    return sortedTable.findIndex(t => t.team === teamName) + 1;
  }

  // Parse "runs/overs" format like "1130/133.1"
  private parseStats(runOversString: string): { runs: number; balls: number } {
    const [runs, overs] = runOversString.split('/');
    const [wholeOvers, extraBalls = '0'] = overs.split('.');
    return {
      runs: parseInt(runs),
      balls: parseInt(wholeOvers) * 6 + parseInt(extraBalls)
    };
  }

  // Convert balls to overs format
  private ballsToOvers(balls: number): string {
    const overs = Math.floor(balls / 6);
    const extraBalls = balls % 6;
    return extraBalls === 0 ? overs.toString() : `${overs}.${extraBalls}`;
  }
}


