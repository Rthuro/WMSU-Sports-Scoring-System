import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors"
import dotenv from "dotenv"
import path from "path";

// Middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { validate } from "./middleware/validate.js";

// Validators
import { createSportSchema } from "./validators/sportSchema.js";
import { createMatchSchema } from "./validators/matchSchema.js";
import { createTeamSchema } from "./validators/teamSchema.js";
import { createTournamentSchema } from "./validators/tournamentSchema.js";
import { createEventSchema } from "./validators/commonSchemas.js";
import { createAccountSchema } from "./validators/commonSchemas.js";
import { createDepartmentSchema } from "./validators/commonSchemas.js";
import { createPlayerSchema } from "./validators/commonSchemas.js";

// main routes
import matchRoutes from "./routes/matchRoutes.js";
import accountRoutes from "./routes/accountRoutes.js"
import departmentRoutes from "./routes/departmentRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import sportRoutes from "./routes/sportRoutes.js"
import playerRoutes from "./routes/playerRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Sports related routes
import penaltyRoutes from "./routes/sports/penaltyRoutes.js";
import scoringPointsRoutes from "./routes/sports/scoringPointsRoutes.js";
import setRulesRoutes from "./routes/sports/setRulesRoutes.js";
import sportPositionRoutes from "./routes/sports/sportPositionRoutes.js";
import statsRoutes from "./routes/sports/statsRoutes.js";

// Players related routes
import playerTeamRoutes from "./routes/players/playerTeamRoutes.js"
import playerStatsRoutes from "./routes/players/playerStatsRoutes.js";
import playerPenaltyRoutes from "./routes/players/playerPenaltyRoutes.js";

// Tournaments related routes
import tournamentRoutes from "./routes/tournamentRoutes.js";
import tournamentTeamsRoutes from "./routes/tournaments/tournamentTeamsRoutes.js";
import tournamentMatchesRoutes from "./routes/tournaments/tournamentMatchesRoutes.js";
import tournamentTallyRoutes from "./routes/tournaments/tournamentTallyRoutes.js";

// match related routes
import matchPointsRoutes from "./routes/matches/matchPointsRoutes.js";
import matchParticipantsRoutes from "./routes/matches/matchParticipantsRoutes.js";

// public routes
import articleRoutes from "./routes/public/articleRoutes.js";
import publicRoutes from "./routes/public/publicRoutes.js";


import { initDB } from "./config/init/init.js";

dotenv.config();

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan("dev")) // log request


app.use("/api/accounts", accountRoutes)
app.use("/api/departments", departmentRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/sports", sportRoutes)
app.use("/api/match", matchRoutes)
app.use("/api/players", playerRoutes)
app.use("/api/teams", teamRoutes)
app.use("/api/upload", uploadRoutes)

// Sports related routes
app.use("/api/penalties", penaltyRoutes)
app.use("/api/scoring-points", scoringPointsRoutes)
app.use("/api/set-rules", setRulesRoutes)
app.use("/api/sport-positions", sportPositionRoutes)
app.use("/api/stats", statsRoutes)

// // Players related routes
app.use("/api/player-team", playerTeamRoutes)
app.use("/api/player-stats", playerStatsRoutes)
app.use("/api/player-penalties", playerPenaltyRoutes)

// // tournaments related routes
app.use("/api/tournaments", tournamentRoutes)
app.use("/api/tournament-teams", tournamentTeamsRoutes)
app.use("/api/tournament-matches", tournamentMatchesRoutes)
app.use("/api/tournament-tally", tournamentTallyRoutes)

// // match related routes
app.use("/api/match-points", matchPointsRoutes)
app.use("/api/match-participants", matchParticipantsRoutes)

// // public routes
app.use("/api/articles", articleRoutes)
app.use("/api/public", publicRoutes)

// Global error handler — MUST be after all routes
app.use(errorHandler);

// if (process.env.NODE_ENV !== "development") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   app.get("/{*any}", (_, res) => {
//     res.sendFile(path.resolve(__dirname,"frontend", "dist", "index.html"));
//   });
// }

initDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 Allowing requests from: ${allowedOrigin}`);
    });
  })
  .catch((err) => {
    console.error("❌ DATABASE CONNECTION FAILED:");
    console.error(err);
    process.exit(1);
  });
