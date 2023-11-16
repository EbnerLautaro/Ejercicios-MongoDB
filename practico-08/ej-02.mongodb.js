// 2. Cantidad de estados con al menos dos cines (theaters) registrados.

use("mflix")


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
        $match: {
            count: {
                $gte: 2
            }
        }
    },
    {
        $sort: {
          count: -1
        }
    }
])