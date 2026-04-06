import arnis from "../assets/sports/arnis.png"
import basketball from "../assets/sports/basketball.png"
import pickleball from "../assets/sports/pickleball.png"
import tabletennis from "../assets/sports/tabletennis.png"
import taekwondo from "../assets/sports/taekwondo.png"
import volleyball from "../assets/sports/volleyball.png"

export const sportsData = {
    sportsCardData: [
        {
            id: "arnis",
            name: "Arnis",
            icon: arnis ,
            type: "round",
            minPlayers: 1,
            maxPlayers: 1,
            sets: { min: 3, max: 5 },
            scoringPoints: [1],
            maxScore: 10,
            timePerSet: 3
        },
        {
            id: "basketball",
            name: "Basketball",
            icon: basketball,
            type: "set",
            minPlayers: 5,
            maxPlayers: 5,
            sets: { total: 4 },
            scoringPoints: [2, 3],
            maxScore: null,
            timePerSet: 12
        },
        {
            id: "taekwondo",
            name: "Taekwondo",
            icon: taekwondo,
            type: "round",
            minPlayers: 1,
            maxPlayers: 1,
            sets: { total: 3 },
            scoringPoints: [ 2, 3, 5],
            maxScore: null,
            timePerSet: 2
        },
        {
            id: "volleyball",
            name: "Volleyball",
            icon: volleyball,
            type: "set",
            minPlayers: 6,
            maxPlayers: 6,
            sets: { total: 5 },
            scoringPoints: [1],
            maxScore: [25, 15],
            timePerSet: null
        },
        {
            id: "tabletennis",
            name: "TableTennis",
            icon: tabletennis,
            type: "set",
            minPlayers: 1,
            maxPlayers: 2,
            sets: { min: 5, max: 7 },
            scoringPoints: [1],
            maxScore: 11,
            timePerSet: null
        },
        {
            id: "pickleball",
            name: "PickleBall",
            icon: pickleball,
            type: "set",
            minPlayers: 2,
            maxPlayers: 2,
            sets: { total: 3 },
            scoringPoints: [1],
            maxScore: 11,
            timePerSet: null
        }
    ],
    varsityTeam: {
        arnis: {
            coach: "Sir Gomez",
            men: ["Torres", "Delos Reyes", "Gomez", "Villanueva"],
            women: ["Chua", "Santos", "Rosco", "Arilliano"]
        },
        basketball: {
            coach: "Sir Santos",
            men: ["Garcia", "Reyes", "Mendoza", "Flores", "Rivera", "Domingo", "Bautista", "Ramos", "Baltazar", "Natividad", "Alvarez", "De Vera"],
            women: ["Marquez", "Diaz", "Santiago", "Lopez", "Castro", "Dela Cruz", "Aquino", "Austria", "Gonzales", "Fabros", "Dizon", "Luna"]
        },
        taekwondo: {
            coach: "Sir Natividad",
            men: ["Ponce", "Delgado", "Fernandez", "Serrano"],
            women: ["Navarro", "Padilla", "Agustin", "Cuevas"]
        },
        volleyball: {
            coach: "Sir Flores",
            men: ["Vergara", "Salazar", "Caballero", "Ramos", "Baltazar", "Natividad", "Alvarez", "De Vera", "Garcia", "Reyes", "Mendoza", "Flores", "Rivera"],
            women: ["Bermudez", "Cruz", "Tiu", "Austria", "Gonzales", "Fabros", "Dizon", "Luna", "Marquez", "Diaz", "Santiago", "Lopez",]
        },
        tabletennis: {
            coach: "Sir Espino",
            men: ["Sy", "Chavez", "Macaraeg"],
            women: ["Yap", "Velasquez", "Espino"]
        },
        pickleball: {
            coach: "Sir Tan",
            men: ["Lim", "Co", "Zamora"],
            women: ["Tan", "Lazaro", "Gatchalian"]
        }
    }
    

}

export const sportPlayersStats = {
    arnis: [
        {
            name: "Drew Torres",
            sport: "Arnis",
            gender: "men",
            matchesPlayed: 10,
            wins: 9,
            losses: 5,
            totalPointsScored: 45,
            penalties: 4
        }, {
            name: "John Salazar",
            sport: "Arnis",
            gender: "men",
            matchesPlayed: 10,
            wins: 9,
            losses: 5,
            totalPointsScored: 37,
            penalties: 4
        }, {
            name: "Don Zamora",
            sport: "Arnis",
            gender: "men",
            matchesPlayed: 10,
            wins: 9,
            losses: 5,
            totalPointsScored: 37,
            penalties: 4
        },

    ],
    basketball: [
        {
            name: "Kendall Reyes",
            sport: "Basketball",
            gender: "women",
            gamesPlayed: 12,
            points: 99,
            rebounds: 12,
            assists: 28,
            steals: 3,
            blocks: 7,
            turnovers: 3,
            fouls: 6
        },
        {
            name: "Robert Espino",
            sport: "Basketball",
            gender: "women",
            gamesPlayed: 12,
            points: 99,
            rebounds: 12,
            assists: 28,
            steals: 3,
            blocks: 7,
            turnovers: 3,
            fouls: 6
        }, {
            name: "Donny Gatchalian",
            sport: "Basketball",
            gender: "women",
            gamesPlayed: 12,
            points: 99,
            rebounds: 12,
            assists: 28,
            steals: 3,
            blocks: 7,
            turnovers: 3,
            fouls: 6
        }
    ],
    volleyball: [
        {
            name: "Taylor Lopez",
            sport: "Volleyball",
            gender: "men",
            setsPlayed: 21,
            totalPoints: 126,
            kills: 31,
            blocks: 17,
            aces: 5,
            digs: 16,
            errors: 12
        },  {
            name: "Danica Lopez",
            sport: "Volleyball",
            gender: "women",
            setsPlayed: 21,
            totalPoints: 126,
            kills: 31,
            blocks: 17,
            aces: 5,
            digs: 16,
            errors: 12
        },  {
            name: "Kenneth Tan",
            sport: "Volleyball",
            gender: "men",
            setsPlayed: 21,
            totalPoints: 126,
            kills: 31,
            blocks: 17,
            aces: 5,
            digs: 16,
            errors: 12
        },
    ],
    tabletennis : [
        {
            name: "Morgan Flores",
            sport: "Table Tennis",
            gender: "men",
            matchesPlayed: 13,
            wins: 8,
            losses: 4,
            setsWon: 13,
            setsLost: 10,
            pointsScored: 234,
        },  {
            name: "Moon Co",
            sport: "Table Tennis",
            gender: "men",
            matchesPlayed: 13,
            wins: 8,
            losses: 4,
            setsWon: 13,
            setsLost: 10,
            pointsScored: 234,
        },  {
            name: "Cait Lazaro",
            sport: "Table Tennis",
            gender: "men",
            matchesPlayed: 13,
            wins: 8,
            losses: 4,
            setsWon: 13,
            setsLost: 10,
            pointsScored: 234,
        }
    ],
    taekwondo: [
        {
            name: "Drew Villanueva",
            sport: "Taekwondo",
            gender: "women",
            matchesPlayed: 4,
            wins: 0,
            losses: 9,
            roundsWon: 16,
            pointsScored: 99,
            penalties: 4
        },
         {
            name: "Dani Villanueva",
            sport: "Taekwondo",
            gender: "women",
            matchesPlayed: 4,
            wins: 0,
            losses: 9,
            roundsWon: 16,
            pointsScored: 99,
            penalties: 4
        },  {
            name: "Earl Perez",
            sport: "Taekwondo",
            gender: "men",
            matchesPlayed: 4,
            wins: 0,
            losses: 9,
            roundsWon: 16,
            pointsScored: 99,
            penalties: 4
        }
    ],
    pickleball: [
       { 
            name: "Drew Villanueva",
            sport: "Pickleball",
            gender: "women",
            matchesPlayed: 14,
            wins: 12,
            losses: 5,
            setsWon: 19,
            setsLost: 6,
            pointsScored: 123,
        },  { 
            name: "Drew Tiu",
            sport: "Pickleball",
            gender: "men",
            matchesPlayed: 14,
            wins: 12,
            losses: 5,
            setsWon: 19,
            setsLost: 6,
            pointsScored: 123,
        },  { 
            name: "Suny Velasquez",
            sport: "Pickleball",
            gender: "women",
            matchesPlayed: 14,
            wins: 12,
            losses: 5,
            setsWon: 19,
            setsLost: 6,
            pointsScored: 123,
        },
    ]
}