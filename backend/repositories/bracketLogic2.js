    // 3. Generate bracket matches based on bracketing type
    if (teamIds.length >= 2) {
      const allTeams = await txSql(`SELECT team_id, name FROM teams WHERE team_id = ANY($1)`, [teamIds]);
      const teamMap = {};
      for (const t of allTeams) { teamMap[t.team_id] = t.name; }
      const getTeamName = (id) => teamMap[id] || "TBD";

      if (data.bracketing === "round-robin") {
        for (let i = 0; i < teamIds.length; i++) {
          for (let j = i + 1; j < teamIds.length; j++) {
            const matchId = crypto.randomUUID();
            const matchName = `${getTeamName(teamIds[i])} vs ${getTeamName(teamIds[j])}`;
            await txSql(
              `INSERT INTO tournament_matches (match_id, sport_id, tournament_id, match_name, team_a_id, team_b_id, round)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [matchId, data.sport_id, data.tournament_id, matchName, teamIds[i], teamIds[j], 1]
            );
          }
        }
      } else if (data.bracketing === "single-elimination") {
        const shuffled = [...teamIds].sort(() => Math.random() - 0.5);
        let size = 2;
        while (size < shuffled.length) size *= 2;
        while (shuffled.length < size) shuffled.push(null); // pad with BYES
        
        let round = 1;
        let matchesInRound = size / 2;
        while (matchesInRound >= 1) {
          for (let i = 0; i < matchesInRound; i++) {
            const matchId = `SE_R${round}_M${i+1}`;
            let team1 = null, team2 = null, matchName = "";
            if (round === 1) {
              team1 = shuffled[i * 2];
              team2 = shuffled[i * 2 + 1];
              matchName = `R${round} M${i+1} (${team1 ? getTeamName(team1) : 'BYE'} vs ${team2 ? getTeamName(team2) : 'BYE'})`;
            } else {
              matchName = `R${round} M${i+1}`;
            }
            await txSql(
              `INSERT INTO tournament_matches (match_id, sport_id, tournament_id, match_name, team_a_id, team_b_id, round)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [matchId, data.sport_id, data.tournament_id, matchName, team1, team2, round]
            );
          }
          round++;
          matchesInRound /= 2;
        }
      } else if (data.bracketing === "double-elimination") {
        const shuffled = [...teamIds].sort(() => Math.random() - 0.5);
        let size = 2;
        while (size < shuffled.length) size *= 2;
        while (shuffled.length < size) shuffled.push(null); // pad with BYES

        // Upper Bracket
        let ubRound = 1;
        let ubMatchesInRound = size / 2;
        while (ubMatchesInRound >= 1) {
          for (let i = 0; i < ubMatchesInRound; i++) {
            const matchId = `DE_UB_R${ubRound}_M${i+1}`;
            let team1 = null, team2 = null, matchName = "";
            if (ubRound === 1) {
              team1 = shuffled[i * 2];
              team2 = shuffled[i * 2 + 1];
              matchName = `UB R${ubRound} M${i+1} (${team1 ? getTeamName(team1) : 'BYE'} vs ${team2 ? getTeamName(team2) : 'BYE'})`;
            } else {
              matchName = `UB R${ubRound} M${i+1}`;
            }
            await txSql(
              `INSERT INTO tournament_matches (match_id, sport_id, tournament_id, match_name, team_a_id, team_b_id, round)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [matchId, data.sport_id, data.tournament_id, matchName, team1, team2, ubRound]
            );
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
            const matchId = `DE_LB_R${currentLbRound}_M${i+1}`;
            const matchName = `LB R${currentLbRound} M${i+1}`;
            await txSql(
              `INSERT INTO tournament_matches (match_id, sport_id, tournament_id, match_name, team_a_id, team_b_id, round)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [matchId, data.sport_id, data.tournament_id, matchName, null, null, currentLbRound]
            );
          }
          currentLbRound++;
          if (currentLbRound % 2 !== 0) lbMatchesInRound /= 2;
        }

        // Grand Final
        const grandFinalId = `DE_FINAL`;
        await txSql(
          `INSERT INTO tournament_matches (match_id, sport_id, tournament_id, match_name, team_a_id, team_b_id, round)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [grandFinalId, data.sport_id, data.tournament_id, "Grand Final", null, null, 99]
        );
      }
    }
