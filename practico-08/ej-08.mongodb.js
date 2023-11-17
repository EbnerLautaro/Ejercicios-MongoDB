// Título, año y cantidad de comentarios de las 10 películas con más comentarios.
use("mflix")
db.movies.aggregate()

// ESTA MAL VER EL EJ 9
db.movies.aggregate([
    {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "movie_id",
            as: "comments"
        }
    },
    {
        $unwind: "$comments"
    },
    {
        $group: {
            _id: "$_id",
            title: {
                $first: "$title"
            },
            year: {
                $first: "$year"
            },
            total: {
                $sum: 1
            }
        }
    },
    {
        $sort:{
            total: -1
        }
    },
    {
        $limit: 10
    },
    {
        $project: {
          _id: 0,
          "titulo": "$title",
          "año": "$year",
          "cantidad de comentarios": "$total"
        }
    },
])