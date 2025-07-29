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
        default: Date.now()
    }
})
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparedPassword(async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)

});

export const User = mongoose.model("User", userSchema);