// Crear una vista con los 5 géneros con mayor cantidad de comentarios, junto con la cantidad de comentarios.

use("mflix")

db.top5genres.find()

db.createView(
    "top5genres",
    "movies",
    [
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "movie_id",
                as: "comments"
            }
        },
        {
            $unwind: "$genres"
        },
        {
            $unwind: "$comments"
        },
        {
            $group: {
                _id: "$genres",
                comment_count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                comment_count: -1
            }
        },
        {
            $limit: 5
        },
    ]
)

