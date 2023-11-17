// Especificar en la colección users las siguientes reglas de validación: 
// El campo name (requerido) debe ser un string con un máximo de 30 caracteres, email (requerido) debe ser un string que matchee con la expresión regular: "^(.*)@(.*)\\.(.{2,4})$" , password (requerido) debe ser un string con al menos 50 caracteres.

use("mflix")
// db.users.find()

db.runCommand({
    collMod: "users",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "email", "password"],
            properties: {
                name: {
                    bsonType: "string",
                    minLength: 30
                },
                email: {
                    bsonType: "string",
                    pattern: "^(.*)@(.*)\\.(.{2,4})$",
                },
                password: {
                    bsonType: "string",
                    minLength: 50
                },
            }
        }
    },

})
