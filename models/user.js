const mongoose = require("mongoose"); // Importing mongoose
const Schema = mongoose.Schema; // Getting Schema from mongoose
const passportLocalMongoose = require("passport-local-mongoose"); // Importing passport-local-mongoose for authentication
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});
userSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User", userSchema); // Exporting the User model