// 1. Cantidad de cines (theaters) por estado.

use("mflix")


db.theaters.findOne()

db.theaters.aggregate([
    {
        $group: {
            _id: "$location.address.state",
            count: {
                $sum: 1
            }
        }
    },
    {
        $sort: {
            count: -1
        }
    }
])
