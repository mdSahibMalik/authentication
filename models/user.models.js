import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: {
        type: String,
        minLength: [8, 'Password must be have minimum 8 characters.'],
        masLength: [32, "Password cannot have more than 32 characters."]
    },
    phone: String,
    accountvarified: { type: Boolean, default: false },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparedPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};

userSchema.methods.generateVerificationCode = function () {
    function generateRandomeDigit() {
        const firstdigit = Math.floor(Math.random() * 9) + 1;
        const remainDigit = Math.floor(Math.random() * 10000).toString().padStart(4, 0);

        return parseInt(firstdigit + remainDigit);
    }
    const verificationCode = generateRandomeDigit();
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now() + 5 * 60 * 1000;
    return verificationCode;
}

export const User = mongoose.model("User", userSchema);