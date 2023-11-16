// Ratings de IMDB promedio, mínimo y máximo por año de las películas estrenadas en los años 80 (desde 1980 hasta 1989), ordenados de mayor a menor por promedio del año.

use("mflix")

db.movies.aggregate([

    {
        $match: {
            year: {
                $gte: 1980,
                $lte: 1989
            }
        }
    },
    {
        $group: {
          _id: "$year",
          minimo: {
            $min: "$imdb.rating"
          },
          maximo: {
            $max: "$imdb.rating"
          },
          promedio: {
            $avg: "$imdb.rating"
          }
        }
    },
    {
        $sort: {
          promedio: -1
        }
    },
    {
        $project: {
            year: "$_id",
            promedio: 1,
            maximo: 1,
            minimo: 1,
            _id: 0,
        }
    }
])

