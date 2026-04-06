// components/TournamentBracket.jsx

import { Card, CardContent, CardTitle } from "@/components/ui/card";

export function TournamentBracket({ matches }) {
  const rounds = {};

  matches.forEach((match) => {
    if (!rounds[match.round]) rounds[match.round] = [];
    rounds[match.round].push(match);
  });

  const sortedRounds = Object.keys(rounds).sort((a, b) => a - b);

  return (
    <div className="flex gap-8 overflow-x-auto py-4">
      {sortedRounds.map((roundNum) => (
        <div key={roundNum} className="flex flex-col gap-4">
          <h2 className="text-center font-semibold">Round {roundNum}</h2>
          {rounds[roundNum].map((match, index) => (
            <Card key={index} className="w-48 text-center">
              <CardContent className="p-3 flex flex-col gap-2">
                <CardTitle className="text-sm">Match {match.matchId}</CardTitle>
                <div className="text-xs">
                  <p>{match.teamA}</p>
                  <span className="text-muted-foreground">vs</span>
                  <p>{match.teamB}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
