// Obtener metadata de la colección users que garantice que las reglas de validación fueron correctamente aplicadas

use("mflix")
db.getCollectionInfos({name: "users"})

