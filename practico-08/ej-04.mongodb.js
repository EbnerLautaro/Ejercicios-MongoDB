// Cantidad de películas estrenadas en los años 50 (desde 1950 hasta 1959). Se puede responder sin pipeline de agregación, realizar ambas queries

use("mflix")

db.movies.aggregate([
    {
        $match: {
            year: {
                $gte: 1950,
                $lt: 1960
            }
        }
    },
    {
        $count: "Cantidad de películas estrenadas en los años 50"
    }
])

