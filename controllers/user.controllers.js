import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import ErrorHandler from "../middleware/errorHandler.js";
import { User } from "../models/user.models.js";
import { sendMail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";

const register = asyncErrorHandler(async (req, res, next) => {
  try {
    const { name, email, password, phone, verificationMethod } = req.body;

    if (!name || !email || !password || !phone || !verificationMethod) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    function validationPhoneNumber(phone) {
      const phoneStr = phone.toString()
      const phoneRegex = /^(?:\+91)?[6789]\d{9}$/;
      return phoneRegex.test(phoneStr);
    }
    if (!validationPhoneNumber(phone)) {
      return next(new ErrorHandler("Invalid phone number ", 400));
    }

    const existingUser = await User.findOne({ $or: [{ email, accountverified: true, phone, accountverified: true }] });


    if (existingUser) {
      return next(new ErrorHandler("User already registered by email or phone", 400));
    }
    const registerUserAttemt = await User.find({
      $or: [{
        phone, accountverified: false,
        email, accountverified: false
      }]
    });
    if (registerUserAttemt.length > 3) {
      return next(new ErrorHandler("Registered attemp reached, Try again after some time", 400));
    }
    const userCreated = { name, email, password, phone };


    const user = await User.create(userCreated);


    const verificationCode = user.generateVerificationCode();


    await sendVerificationCode(verificationMethod, verificationCode, email, phone);

    user.save({ validateBeforeSave: true });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    next(error)
  }
})

async function sendVerificationCode(verificationMethod, verificationCode, email, phone) {
  if (verificationMethod === 'email') {
    const message = generateEmailTemplate(verificationCode);
    await sendMail({ email, subject: "Verify your email.", message });
  }

}

function generateEmailTemplate(verificationCode) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f9fb;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 480px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
      padding: 30px;
    }
    h2 {
      color: #2c3e50;
    }
    .code-box {
      background-color: #f1f3f5;
      padding: 15px;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 4px;
      text-align: center;
      border-radius: 6px;
      margin: 20px 0;
      color: #2c3e50;
    }
    .footer {
      font-size: 12px;
      color: #888;
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Verify Your Email</h2>
    <p>Hi  "there",</p>
    <p>Use the following code to verify your email address:</p>

    <div class="code-box">\`${verificationCode}\`</div>

    <p>This code will expire in 10 minutes. If you didn’t request this, please ignore this email.</p>

    <p>Thanks,<br>The Team</p>

    <div class="footer">
      &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

}

const verifyOTP = asyncErrorHandler(async (req, res, next) => {
  const { email, password, otp } = req.body;
  try {

    const userExist = await User.find({ email: email, accountverified: false }).sort({ createdAt: -1 }).select("-password");



    if (!userExist) {
      return next(new ErrorHandler("'user does't exist ", 404));
    }


    let storeUser;

    if (userExist.length > 1) {
      storeUser = userExist[0];

      await User.deleteMany({
        _id: { $ne: storeUser._id },
        email: email, accountverified: false
      });
    } else {
      storeUser = userExist[0];
    }

    //* check user's OTP is valid or not
    if(storeUser.verificationCode !== Number(otp)){
      return next(new ErrorHandler("OTP is not valid", 401));
    }

    
    const currentDate = Date.now();
    const verificationCodeExpire = new Date(storeUser.verificationCodeExpire).getTime();
    
    if(currentDate > verificationCodeExpire){
      return next( new ErrorHandler("OTP expired.", 401));
    }
    
    storeUser.accountverified = true;
    storeUser.verificationCode = null;
    storeUser.verificationCodeExpire = null;
    storeUser.save({validateModifiedOnly: true});

    //! you can send token at the verified OTP time or at the login time as you wish you can do what you want.

    await sendToken(storeUser, 200,"Account verified", res);

  //  return res.status(200).json({success: true, message: 'OTP verified successfully', });

  } catch (error) {
    next(error);
  }
})



export { register, verifyOTP };