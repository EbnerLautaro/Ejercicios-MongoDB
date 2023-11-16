// Top 10 de usuarios con mayor cantidad de comentarios, mostrando Nombre, Email y Cantidad de Comentarios

use("mflix")

db.comments.aggregate([
  {
    $group: {
      _id: "$email",
      name: {
        $first: "$name"
      },
      total: {
        $sum: 1
      },
    }
  },
  {
    $sort: {
      total: -1
    }
  },
  {
    $limit: 10
  },
  {
    $project: {
      _id: 0,
      nombre: "$name",
      email: "$_id",
      "total de comentarios": "$total"
    }
  }
])

