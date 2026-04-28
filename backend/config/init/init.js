import { initSportsTable, 
initScoringPointsTable, 
initSetRulesTable, 
initSportsPositionTable, 
initPenaltyTypesTable
} from "./sports.js"

import { initAccountsTable } from "./accounts.js"
import { initDepartmentsTable } from "./departments.js"
import { initEventsTable, 
initEventAwardsTable
} from "./events.js"
import { initTournamentsTable,
initTournamentMatchesTable,
initTournamentTeamsTable,
initTournamentTallyTable
} from "./tournaments.js"
import { initPlayersTable,
initPlayerTeamsTable,
initPlayerStatsTable,
initPlayerPenaltiesTable
 } from "./players.js"
import { initMatchesTable,
initMatchParticipantsTable,
initMatchPoints
} from "./matches.js" 
import { initStatsTable } from "./stats.js"
import { initTeamsTable } from "./teams.js"
import { initArticlesTable , initWebsiteSettingsTable} from "./public.js"

export async function initDB() {
    try {
        await initAccountsTable();
        await initDepartmentsTable();
        await initEventsTable();
        await initSportsTable();
        await initSetRulesTable();
        await initPenaltyTypesTable();
        await initSportsPositionTable();

        // tables needed: sports
        await initScoringPointsTable();
        await initPlayersTable();
        await initStatsTable();

        // tables needed: events, sports,department
        await initTournamentsTable();
        await initTeamsTable();
        await initMatchesTable();

        // tables needed: tournament
        await initTournamentMatchesTable();

        // tables needed: player, match, team
        await initMatchParticipantsTable();
        await initMatchPoints();

        // tables needed: player, stats, match
        await initPlayerStatsTable();

        // tables needed: teams, tournament
        await initTournamentTeamsTable();

        // tables needed: player, team
        await initPlayerTeamsTable();

        // tables needed: player, match, penalty
        await initPlayerPenaltiesTable();

        // tables needed: player, match,team
        await initTournamentTallyTable();

        // tables needed: event, tournament, team, player
        await initEventAwardsTable();

        // tables needed: website
        await initArticlesTable();
        await initWebsiteSettingsTable();
        
        // console.log("✅ All wmsu-sport tables initialized");
    } catch (error) {
        console.log("Error initDB", error);
    }
}
