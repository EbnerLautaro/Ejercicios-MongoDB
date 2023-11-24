// EJERCICIO 1
// Buscar las ventas realizadas en "London", "Austin" o "San Diego"; a un customer con edad mayor-igual a 18 años que tengan productos que hayan salido al menos 1000 y estén etiquetados (tags) como de tipo "school" o "kids" (pueden tener más etiquetas).
// Mostrar el id de la venta con el nombre "sale", la fecha (“saleDate"), el storeLocation, y el "email del cliente. No mostrar resultados anidados. 

use("supplies")
db.sales.aggregate([
    {
        $match: {
            storeLocation: {
                $in: ["London", "Austin", "San Diego"]
            },
            "customer.age": { $gte: 18 },
            items: {
                $elemMatch: {
                    $and: [
                        { price: { $gte: 1000 } },
                        {
                            tags: {
                                // $elemMatch: { $in: ["school", "kids"] }
                                $in: ["school", "kids"]
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            sale: "$_id",
            date: "$saleDate",
            store: "$storeLocation",
            email: "$customer.email",
        }
    }
])

// EJERCICIO 2
// Buscar las ventas de las tiendas localizadas en Seattle, donde el método de compra sea ‘In store’ o ‘Phone’ y se hayan realizado entre 1 de febrero de 2014 y 31 de enero de 2015 (ambas fechas inclusive). 
//Listar el email y la satisfacción del cliente, y el monto total facturado, donde el monto de cada item se calcula como 'price * quantity'. Mostrar el resultado ordenados por satisfacción (descendente), frente a empate de satisfacción ordenar por email (alfabético). 

use("supplies")
db.sales.aggregate([
    {
        $match: {
            storeLocation: "Seattle",
            purchaseMethod: {
                $in: ["In store", "Phone"]
            },
            saleDate: {
                $gte: new Date("2014-02-01"),
                $lte: new Date("2015-01-31")
            }
        }
    },
    {
        $unwind: "$items"
    },
    {
        $group: {
            _id: "$_id",
            // como agrupo por id y el id es unico, puedo utilizar first (no hay problema)
            email: { $first: "$customer.email" },
            satisfaction: { $first: "$customer.satisfaction" },
            total: {
                $sum: { $multiply: ["$items.price", "$items.quantity"] }
            }
        }
    },
    {
        $sort: {
            satisfaction: -1,
            email: 1
        }
    }

])

// EJERCICIO 3
// Crear la vista salesInvoiced que calcula el monto mínimo, monto máximo, monto total y monto promedio facturado por año y mes.  Mostrar el resultado en orden cronológico. No se debe mostrar campos anidados en el resultado.

use("supplies")
// db.salesInvoiced.find()
db.createView(
    "salesInvoiced",
    "sales",
    [
        {
            $unwind: "$items"
        },
        {
            $group: {
                _id: "$_id",
                date: { $first: "$saleDate" },
                total_individual_sale: {
                    $sum: { $multiply: ["$items.price", "$items.quantity"] }
                }
            }
        },
        {
            $group: {
                _id: {
                    "year": { $year: "$date" },
                    "month": { $month: "$date" }
                },
                max: { $max: "$total_individual_sale" },
                min: { $min: "$total_individual_sale" },
                total: { $sum: "$total_individual_sale" }
            }
        },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                max: "$max",
                min: "$min",
                total: "$total",
            }
        },
        {
            $sort: {
                year: 1,
                month: 1,
            }
        }
    ]
)

// EJERCICIO 4
// Mostrar el storeLocation, la venta promedio de ese local, el objetivo a cumplir de ventas (dentro de la colección storeObjectives) y la diferencia entre el promedio y el objetivo de todos los locales

use("supplies")
db.sales.aggregate([
    {
        $unwind: "$items"
    },
    {
        $group: {
            _id: "$storeLocation",
            date: {
                $first: "$saleDate"
            },
            average_sale: {
                $avg: {
                    $sum: {
                        $multiply: ["$items.price", "$items.quantity"]
                    }
                }

            }
        }
    },
    {
        $lookup: {
            from: "storeObjectives",
            localField: "_id",
            foreignField: "_id",
            as: "storeObjectives"
        }
    },
    {
        // sin esto tengo una lista, con la cual no puedo restar abajo
        $unwind: "$storeObjectives"
    },
    {
        $project: {
            _id: 0,
            storeLocation: "$_id",
            average_sale: "$average_sale",
            objective: "$storeObjectives.objective",
            difference: {
                $subtract: ["$average_sale", "$storeObjectives.objective"]
            }
        }
    }
])

// EJERCICIO 5
// Especificar reglas de validación en la colección sales utilizando JSON Schema. 
// Las reglas se deben aplicar sobre los campos: saleDate, storeLocation, purchaseMethod, y  customer ( y todos sus campos anidados ). Inferir los tipos y otras restricciones que considere adecuados para especificar las reglas a partir de los documentos de la colección. 
// Para testear las reglas de validación crear un caso de falla en la regla de validación y un caso de éxito (Indicar si es caso de falla o éxito)

use("supplies")
db.runCommand({
    collMod: "sales",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["storeLocation", "saleDate", "customer"],
            properties: {
                saleDate: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                customer: {
                    bsonType: "object",
                    description: "must be an object and is required",
                    required: ["email"],
                    properties: {
                        email: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        gender: {
                            enum: ["M", "F", null],
                            description: "must be a valid option"
                        },
                        satisfaction: {
                            bsonType: "int",
                            minimum: 0,
                            description: "must be at least 0"
                            // maximum: 5 (no se)
                        }

                    }
                },
                storeLocation: {
                    bsonType: "string",
                    description: "must be a string and is required"
                }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
})

// TEST INSERT
// ALL PASS
db.sales.insertOne({
    saleDate: new Date(),
    customer: {
        email: "example@example.com",
        gender: "M",
        satisfaction: 3
    },
    storeLocation: "Denver"
})
// saleDate FAIL
db.sales.insertOne({
    saleDate: "no se inserta",
    customer: {
        email: "example@example.com",
        gender: "M",
        satisfaction: 3
    },
    storeLocation: "Denver"
})
// saleDate PASS
db.sales.insertOne({
    saleDate: new Date(),
    customer: {
        email: "example@example.com",
        gender: "M",
        satisfaction: 3
    },
    storeLocation: "Denver"
})
// customer FAIL
db.sales.insertOne({
    saleDate: new Date(),
    // customer: {
    //     email: "example@example.com",
    //     gender: "M",
    //     satisfaction: 3
    // },
    storeLocation: "Denver"
})
// customer PASS
db.sales.insertOne({
    saleDate: new Date(),
    customer: {
        email: "example@example.com",
        gender: "M",
        satisfaction: 3
    },
    storeLocation: "Denver"
})
// customer email FAIL
db.sales.insertOne({
    saleDate: new Date(),
    customer: {
        email: 0,
        gender: "M",
        satisfaction: 3
    },
    storeLocation: "Denver"
})
// customer email PASS
db.sales.insertOne({
    saleDate: new Date(),
    customer: {
        email: "example@example.com",
        gender: "M",
        satisfaction: 3
    },
    storeLocation: "Denver"
})
// customer gender FAIL
db.sales.insertOne({
    saleDate: new Date(),
    customer: {
        email: "example@example.com",
        gender: "P",
        satisfaction: 3
    },
    storeLocation: "Denver"
})
// customer gender PASS
db.sales.insertOne({
    saleDate: new Date(),
    customer: {
        email: "example@example.com",
        gender: "M",
        satisfaction: 3
    },
    storeLocation: "Denver"
})
// customer satisfaction FAIL
db.sales.insertOne({
    saleDate: new Date(),
    customer: {
        email: "example@example.com",
        gender: "M",
        satisfaction: -3
    },
    storeLocation: "Denver"
})
// customer satisfaction PASS
db.sales.insertOne({
    saleDate: new Date(),
    customer: {
        email: "example@example.com",
        gender: "M",
        satisfaction: 3
    },
    storeLocation: "Denver"
})