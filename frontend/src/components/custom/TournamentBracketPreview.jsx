import React, { useRef } from "react";
import { SingleEliminationBracket, DoubleEliminationBracket, Match, SVGViewer, createTheme } from "@g-loot/react-tournament-brackets";

const WMSUTheme = createTheme({
  textColor: { main: "#1e293b", highlighted: "#0f172a", dark: "#0f172a" },
  matchBackground: { wonColor: "#e0f2fe", lostColor: "#f1f5f9" },
  score: {
    background: { wonColor: "#0ea5e9", lostColor: "#94a3b8" },
    text: { highlightedWonColor: "#ffffff", highlightedLostColor: "#ffffff" },
  },
  border: { color: "#cbd5e1", highlightedColor: "#0ea5e9" },
  roundHeader: { backgroundColor: "#0284c7", fontColor: "#ffffff" },
  connectorColor: "#94a3b8",
  connectorColorHighlight: "#0ea5e9",
  svgBackground: "#ffffff",
});

function getTeamDetails(teamId, teams, winnerId) {
  if (!teamId) return { id: crypto.randomUUID(), name: "TBD", isWinner: false, resultText: "" };
  const team = teams.find(t => t.team_id === teamId);
  return {
    id: teamId,
    name: team ? team.name : "Unknown",
    isWinner: winnerId && teamId === winnerId,
    resultText: winnerId && teamId === winnerId ? "Won" : "Lost"
  };
}

export function generateMockBracket(teamIds, type, teamsList) {
  if (teamIds.length < 2) return [];
  const matches = [];
  const tournamentId = 'PREVIEW';

  if (type === 'round-robin') {
    let matchCounter = 1;
    for (let i = 0; i < teamIds.length; i++) {
      for (let j = i + 1; j < teamIds.length; j++) {
        matches.push({
          match_id: `${tournamentId}_RR_M${matchCounter++}`,
          match_name: `Match ${matchCounter - 1}`,
          team_a_id: teamIds[i],
          team_b_id: teamIds[j],
          round: 1
        });
      }
    }
  } else if (type === 'single-elimination') {
    const shuffled = [...teamIds];
    let size = 2;
    while (size < shuffled.length) size *= 2;
    while (shuffled.length < size) shuffled.push(null);

    let round = 1;
    let matchesInRound = size / 2;
    while (matchesInRound >= 1) {
      for (let i = 0; i < matchesInRound; i++) {
        const matchId = `${tournamentId}_SE_R${round}_M${i + 1}`;
        let team1 = null, team2 = null, matchName = "";
        if (round === 1) {
          team1 = shuffled[i * 2];
          team2 = shuffled[i * 2 + 1];
          matchName = `R${round} M${i + 1}`;
        } else {
          matchName = `R${round} M${i + 1}`;
        }
        matches.push({ match_id: matchId, match_name: matchName, team_a_id: team1, team_b_id: team2, round });
      }
      round++;
      matchesInRound /= 2;
    }
  } else if (type === 'double-elimination') {
    const shuffled = [...teamIds];
    let size = 2;
    while (size < shuffled.length) size *= 2;
    while (shuffled.length < size) shuffled.push(null);

    // Upper Bracket
    let ubRound = 1;
    let ubMatchesInRound = size / 2;
    while (ubMatchesInRound >= 1) {
      for (let i = 0; i < ubMatchesInRound; i++) {
        const matchId = `${tournamentId}_DE_UB_R${ubRound}_M${i + 1}`;
        let team1 = null, team2 = null, matchName = "";
        if (ubRound === 1) {
          team1 = shuffled[i * 2];
          team2 = shuffled[i * 2 + 1];
          matchName = `UB R${ubRound} M${i + 1}`;
        } else {
          matchName = `UB R${ubRound} M${i + 1}`;
        }
        matches.push({ match_id: matchId, match_name: matchName, team_a_id: team1, team_b_id: team2, round: ubRound });
      }
      ubRound++;
      ubMatchesInRound /= 2;
    }

    // Lower Bracket
    let lbRounds = (Math.log2(size) - 1) * 2;
    let lbMatchesInRound = size / 4;
    let currentLbRound = 1;
    while (currentLbRound <= lbRounds) {
      for (let i = 0; i < lbMatchesInRound; i++) {
        const matchId = `${tournamentId}_DE_LB_R${currentLbRound}_M${i + 1}`;
        const matchName = `LB R${currentLbRound} M${i + 1}`;
        matches.push({ match_id: matchId, match_name: matchName, team_a_id: null, team_b_id: null, round: currentLbRound });
      }
      currentLbRound++;
      if (currentLbRound % 2 !== 0) lbMatchesInRound /= 2;
    }
    matches.push({ match_id: `${tournamentId}_DE_FINAL`, match_name: "Grand Final", team_a_id: null, team_b_id: null, round: 99 });
  }

  return matches;
}

export function TournamentBracketPreview({ bracketingType, matches = [], teams = [], onMatchClick }) {
  const containerRef = useRef(null);

  if (matches.length === 0) {
    return <div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg">No matches generated yet. Add teams to preview.</div>;
  }

  // ── Round Robin (Grid View) ──
  if (bracketingType === "round-robin") {
    return (
      <div className="overflow-x-auto" ref={containerRef}>
        <table className="w-full text-sm text-left border-collapse border border-slate-200">
          <thead className="text-xs text-secondary-foreground bg-slate-100 uppercase">
            <tr>
              <th className="px-4 py-3 border border-slate-200">Match ID</th>
              <th className="px-4 py-3 border border-slate-200">Match Info</th>
              <th className="px-4 py-3 border border-slate-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => (
              <tr key={m.match_id} className="bg-white border-b hover:bg-slate-50 cursor-pointer" onClick={() => onMatchClick && onMatchClick(m)}>
                <td className="px-4 py-3 border border-slate-200">{m.match_name.split(' ')[0]}</td>
                <td className="px-4 py-3 font-medium border border-slate-200">
                  {teams.find(t => t.team_id === m.team_a_id)?.name || 'TBD'} <span className="text-slate-400 mx-2">vs</span> {teams.find(t => t.team_id === m.team_b_id)?.name || 'TBD'}
                </td>
                <td className="px-4 py-3 border border-slate-200">
                  <span className="text-blue-600 underline">Match Details</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Single & Double Elimination (GLOOT) ──

  const formattedMatches = matches.map(m => {
    // Attempt to compute nextMatchId mathematically based on our deterministic IDs
    let nextMatchId = null;
    let tournamentRoundText = String(m.round);

    if (m.match_id.includes("_SE_R")) {
      const parts = m.match_id.match(/_SE_R(\d+)_M(\d+)/);
      if (parts) {
        const r = parseInt(parts[1], 10);
        const mIdx = parseInt(parts[2], 10);
        const nextId = m.match_id.replace(`_SE_R${r}_M${mIdx}`, `_SE_R${r + 1}_M${Math.ceil(mIdx / 2)}`);
        if (matches.some(x => x.match_id === nextId)) {
          nextMatchId = nextId;
        }
      }
    } else if (m.match_id.includes("_DE_UB_R")) {
      const parts = m.match_id.match(/_DE_UB_R(\d+)_M(\d+)/);
      if (parts) {
        const r = parseInt(parts[1], 10);
        const mIdx = parseInt(parts[2], 10);
        const nextId = m.match_id.replace(`_DE_UB_R${r}_M${mIdx}`, `_DE_UB_R${r + 1}_M${Math.ceil(mIdx / 2)}`);
        if (matches.some(x => x.match_id === nextId)) {
          nextMatchId = nextId;
        } else {
          // If it's the last UB match, next is FINAL
          nextMatchId = m.match_id.split("_DE_")[0] + "_DE_FINAL";
        }
      }
    } else if (m.match_id.includes("_DE_LB_R")) {
      const parts = m.match_id.match(/_DE_LB_R(\d+)_M(\d+)/);
      if (parts) {
        const r = parseInt(parts[1], 10);
        const mIdx = parseInt(parts[2], 10);
        // Lower bracket logic: Every EVEN round halves the number of matches, ODD rounds have same number
        let nextMIdx = r % 2 === 0 ? Math.ceil(mIdx / 2) : mIdx;
        const nextId = m.match_id.replace(`_DE_LB_R${r}_M${mIdx}`, `_DE_LB_R${r + 1}_M${nextMIdx}`);
        if (matches.some(x => x.match_id === nextId)) {
          nextMatchId = nextId;
        } else {
          // Last LB match goes to FINAL
          nextMatchId = m.match_id.split("_DE_")[0] + "_DE_FINAL";
        }
      }
    }

    // Determine Winners visually using the winner_id column
    const p1 = getTeamDetails(m.team_a_id, teams, m.winner_id);
    const p2 = getTeamDetails(m.team_b_id, teams, m.winner_id);

    return {
      id: m.match_id,
      name: m.match_name,
      nextMatchId,
      tournamentRoundText: tournamentRoundText,
      state: m.is_finished ? 'DONE' : 'PLAYED',
      participants: [p1, p2]
    };
  });

  const finalHeight = 600;
  const finalWidth = 1000;

  if (bracketingType === "single-elimination") {
    return (
      <div className="w-full bg-gray-200 border rounded-lg overflow-hidden flex justify-center items-center" ref={containerRef} style={{ minHeight: '500px' }}>
        <SingleEliminationBracket
          matches={formattedMatches}
          matchComponent={Match}
          theme={WMSUTheme}
          svgWrapper={({ children, ...props }) => (
            <SVGViewer width={finalWidth} height={finalHeight} background="#ffffff" SVGBackground="#ffffff" {...props}>
              {children}
            </SVGViewer>
          )}
          onMatchClick={({ match }) => onMatchClick && onMatchClick(matches.find(m => m.match_id === match.id))}
        />
      </div>
    );
  }

  if (bracketingType === "double-elimination") {
    // Split into upper and lower
    const upper = formattedMatches.filter(m => !m.id.includes('_LB_') && !m.id.includes('_FINAL'));
    const lower = formattedMatches.filter(m => m.id.includes('_LB_'));
    const finals = formattedMatches.filter(m => m.id.includes('_FINAL'));

    // G-loot doesn't inherently have a "finals" separate array, but wait!
    // We can just append the Finals to the Upper bracket array in G-Loot Double Elim structure.
    const upperWithFinal = [...upper, ...finals];

    return (
      <div className="w-full bg-white border rounded-lg overflow-hidden flex justify-center items-center" ref={containerRef} style={{ minHeight: '500px' }}>
        <DoubleEliminationBracket
          matches={{ upper: upperWithFinal, lower }}
          matchComponent={Match}
          theme={WMSUTheme}
          svgWrapper={({ children, ...props }) => (
            <SVGViewer width={finalWidth} height={finalHeight} background="#ffffff" SVGBackground="#ffffff" {...props}>
              {children}
            </SVGViewer>
          )}
          onMatchClick={({ match }) => onMatchClick && onMatchClick(matches.find(m => m.match_id === match.id))}
        />
      </div>
    );
  }

  return null;
}
