const mongoose = require('mongoose')

// Definimos os campos que nossos registros terão.
const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    password: { 
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique:true,
        required: true,
        lowercase:true,
    },
    number: { 
        type: String,
        required: true,
        minLength: [10, 'Esse número é invalido'],
        maxLength: [11, 'Número muito grande!! ele existe?'],
    },
    age: { 
        type: String,
        minLength: 2,
        max: [65, 'Acho que você é muito velho pra usar o site'],
        min: [17, 'Muito novo, você realmente esta na falcudade?'],
        maxLength: [2, 'Ancião?'],       
        required: true,
    },
    CreateDt: {
        type: Date,
        default: Date.now,
    }
    
})

// Criamos o Model
const User = mongoose.model("User", userSchema)

module.exports = User