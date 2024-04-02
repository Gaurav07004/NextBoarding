const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    PhoneNumber: {
        type: Number,
        default: '',
    },
    MaritalStatus: {
        type: String,
        default: '',
    },
    Gender: {
        type: String,
        default: '',
    },
    Address: {
        type: String,
        default: '',
    },
});

userSchema.pre("save", async function(next) {
    console.log(this);
    const user_data = this;

    if (!user_data.isModified("password")) {
        return next();
    };

    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user_data.password, saltRound);
        
        user_data.password = hash_password;
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.generateToken = async function() {
    try {
        const token = jwt.sign({
            userId: this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin,
        },
            process.env.JWT_SEC_KEY, {
                expiresIn: "01d",
            }
        );
        return token;
    } catch (error) {
        console.error(error);
    }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
