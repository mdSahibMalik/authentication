import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: {
        type: String,
        minLength: [8, 'Password must be have minimum 8 characters.'],
        masLength: [32, "Password cannot have more than 32 characters."],
        select: false
    },
    phone: String,
    accountverified: { type: Boolean, default: false },
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

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};

userSchema.methods.generateToken = async function () {
    return await jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME
    })
}

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

userSchema.methods.generateResetToken = function () {
    const resetTokenKey = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetTokenKey).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetTokenKey;
}

export const User = mongoose.model("User", userSchema);