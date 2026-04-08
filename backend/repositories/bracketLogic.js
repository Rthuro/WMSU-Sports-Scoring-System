// Double elimination tree logic for N teams
function generateBracket(teamIds, type, tournamentId, sportId) {
    const matches = [];
    const getTeamName = (id) => "Team " + id; // Mock

    if (type === "single-elimination") {
        // Find next power of 2
        let size = 2;
        while (size < teamIds.length) size *= 2;
        
        let paddedTeams = [...teamIds];
        while (paddedTeams.length < size) paddedTeams.push(null);
        paddedTeams.sort(() => Math.random() - 0.5);

        let round = 1;
        let prevRoundMatches = [];
        
        // R1
        for (let i = 0; i < size/2; i++) {
            const matchId = `M_${round}_${i}`;
            matches.push({
                match_id: matchId,
                match_name: `R${round} M${i+1}`,
                team_a_id: paddedTeams[i*2],
                team_b_id: paddedTeams[i*2+1],
                round: round
            });
            prevRoundMatches.push(matchId);
        }

        // Subsequent Rounds
        let remainingMatches = size / 4;
        while (remainingMatches >= 1) {
            round++;
            let currentRoundMatches = [];
            for (let i = 0; i < remainingMatches; i++) {
                const matchId = `M_${round}_${i}`;
                matches.push({
                    match_id: matchId,
                    match_name: `R${round} M${i+1}`,
                    team_a_id: null,
                    team_b_id: null,
                    round: round,
                    // we could save prev matches here if needed, but DB schema doesn't have it.
                });
                currentRoundMatches.push(matchId);
            }
            prevRoundMatches = currentRoundMatches;
            remainingMatches /= 2;
        }
    }
}
