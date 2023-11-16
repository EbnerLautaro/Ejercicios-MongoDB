// Remover todos los comentarios realizados por el usuario cuyo email es victor_patel@fakegmail.com durante el año 1980.

use("mflix")

// db.comments.find({
//     "email": "victor_patel@fakegmail.com"
// })

db.comments.deleteMany(
    {
        "email": "victor_patel@fakegmail.com",
        "date": {
            $gte: new Date("1980-01-01"),
            $lt: new Date("1981-01-01")
        }
    }
)
