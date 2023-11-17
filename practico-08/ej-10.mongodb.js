// Listar los actores (cast) que trabajaron en 2 o más películas dirigidas por "Jules Bass". Devolver el nombre de estos actores junto con la lista de películas (solo título y año) dirigidas por “Jules Bass” en las que trabajaron.
// a. Hint1: addToSet
// b. Hint2: {'name.2': {$exists: true}} permite filtrar arrays con al menos 2 elementos, entender por qué.
// c. Hint3: Puede que tu solución no use Hint1 ni Hint2 e igualmente sea correcta


use("mflix")
db.movies.aggregate([

    {
        $unwind: "$directors"
    },
    {
        $match: {
          directors: "Jules Bass"
        }
    },
    {
        $unwind: "$cast"
    },
    {
        $group: {
            _id: "$cast",
            movies: {
                $addToSet: {
                    title: "$title",
                    year: "$year"
                }
            },
            movies_count: {
                $sum: 1
            }
        }
    },
    {
        $match: {
          movies_count: {
            $gte: 2
          }
        }
    },
    {
        $unwind: "$movies"
    },
    {
        $project: {
            _id: 0,
            actor: "$_id",
            titulo: "$movies.title",
            año: "$movies.year",
        }
    }
])

