const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        username: String,
        name: String,
        password: String,
        timestamps: [ {
            title: String,
            category: String,
            date: String,
            elapsedTime: Number,
        }],
    },
    {
        collection: 'users'
    }
);

UserSchema.pre("save", async function(next) {
    const user = this;
    try{
        if(!user.isModified("password")) next();
        let hash = await bcrypt.hash(user.password, 13);
        user.password = hash;
        next();
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

UserSchema.methods.comparePassword = async function(password) {
    try{
        let result = await bcrypt.compare(password, this.password);
        return result;
    }
    catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = mongoose.model("user", UserSchema);