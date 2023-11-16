// Cantidad de películas dirigidas por "Louis Lumière". Se puede responder sin pipeline de agregación, realizar ambas queries.

use("mflix")

db.movies.aggregate([
    {
        $match: {
            directors: {
                $elemMatch: {
                    $eq: "Louis Lumière"
                }
            }
        }
    },
    {
        $count: 'total de peliculas dirigidas por Louis Lumière'
    }
])


// Cantidad de películas dirigidas por "Louis Lumière". Se puede responder sin pipeline de agregación, realizar ambas queries.

use("mflix")

db.movies.find(
    {
        directors: {
            $elemMatch: {
                $eq: "Louis Lumière"
            }
        }
    }
).count()
