// Listar los usuarios que realizaron comentarios durante el mismo año de lanzamiento de la película comentada, mostrando Nombre, Email, fecha del comentario, título de la película, fecha de lanzamiento. HINT: usar $lookup con multiple  condiciones


use("mflix")


db.comments.aggregate([
    {
        $lookup: {
          from: "movies",
          localField: "movie_id",
          foreignField: "_id",
          as: "movie"
        }
    },
    {
        $unwind: "$movie"
    },
    {
        $match: {
            "movie.year": {
                $eq: {
                    $year: "$date"
                }
            }
        }
    }


])

