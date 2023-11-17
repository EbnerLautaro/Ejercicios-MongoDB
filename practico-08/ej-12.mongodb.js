// Listar el id y nombre de los restaurantes junto con su puntuación máxima, mínima y la suma total. Se puede asumir que el restaurant_id es único


use("restaurantdb")
db.restaurants.aggregate([

    {
        $unwind: "$grades"
    },
    {
        $group: {
            _id: "$_id",
            nombre: {$first: "$name"},
            max: {$max: "$grades.score"},
            min: {$min: "$grades.score"},
            sum: {$sum: "$grades.score"},
        }
    },
    {   
        $project: {
          nombre: "$nombre",
          maximo: "$max",
          minimo: "$min",
          sumatoria: "$sum",

        }
    }

])
