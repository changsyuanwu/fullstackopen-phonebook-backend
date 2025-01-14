const path = require("path")
require("@dotenvx/dotenvx").config({
  path: path.resolve(__dirname, "../.env"),
})
const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_ATLAS_URL
console.log("connecting to", url)

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((err) => {
    console.log("error connecting to MongoDB", err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (n) => {
        return /\d{2,3}-\d+/.test(n)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Person", personSchema)