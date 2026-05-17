const { uploadFile } = require("../service/storage.service");
const userModel = require("../model/user.model");
const partnerModel = require("../model/foodPartner.model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function registerUser(req, res) {
  const { fullName, email, password, PhoneNumber, Address } = req.body;
  const isUserAlreadyExit = await userModel.findOne({
    email
  })

  if (isUserAlreadyExit) {
    return res.status(400).json({
      message: "user already exists"
    })
  }
  const hashPassword = await bcrypt.hash(password, 10)


  const user = await userModel.create({
    fullName,
    email,
    password: hashPassword,
    PhoneNumber,
    Address
  })
  const token = jwt.sign({
     id: user._id,
     fullName: user.fullName

  }, process.env.JWT_SECRET)

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(201).json({
    message: "user registration successfully",
    user: {
      _id: user._id,
      email: user.email,
   
    }
  })
}


async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email
  })
  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password"
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invaid email or password"
    })
  }
  const token = jwt.sign({
    id: user._id
  }, process.env.JWT_SECRET)

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(201).json({
    message: "user login successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName
    }
  })
}

function logoutUser(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });
  res.status(200).json({
    message: "User is logout"
  })
}

async function getUserProfile(req, res) {
  res.status(200).json({
    success: true,
    user: req.user
  });
}

async function changeUserPassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  const user = await userModel.findById(req.user._id);

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Old password is incorrect"
    })
  }
  const hashPassword = await bcrypt.hash(newPassword, 10)
  user.password = hashPassword;
  await user.save();

  res.status(200).json({
    message: "Password changed successfully"
  })
}




async function registerPartner(req, res) {
  const { fullName, contactName, phone, address, email, password } = req.body;

  const isPartnerAlreadyExits = await partnerModel.findOne({
    email
  })

  if (isPartnerAlreadyExits) {
    return res.status(400).json({
      message: "partner Already Exist"
    })
  }
  const hashPassword = await bcrypt.hash(password, 10)
  const partner = await partnerModel.create({
    fullName,
    contactName,
    phone,
    email,
    password: hashPassword,
    address
  })

  const token = jwt.sign({
    id: partner._id
  }, process.env.JWT_SECRET)

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    message: "partner registertion successfully",
    partner: {
      _id: partner._id,
      email: partner.email,
      fullName: partner.fullName,
      contactName: partner.contactName,
      phone: partner.phone,
      address: partner.address
    }
  })

}

async function loginPartner(req, res) {
  const { email, password } = req.body;

  const partner = await partnerModel.findOne({
    email
  })
  if (!partner) {
    return res.status(400).json({
      message: "Invaid email or password"
    })
  }
  const isPasswordValid = await bcrypt.compare(password, partner.password)

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invaid email or password"
    })
  }
  const token = jwt.sign({
    id: partner._id,

  }, process.env.JWT_SECRET)

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(201).json({
    message: "Food partner login successfully",
    partner: {
      _id: partner._id,
      email: partner.email,
      fullName: partner.fullName
    }
  })
}
function logoutPartner(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });
  res.status(201).json({
    message: "partner is logout"
  })
}




const uploadUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const base64String = req.file.buffer.toString("base64");

    const uploadedImage = await uploadFile(
      `data:${req.file.mimetype};base64,${base64String}`,
      `avatar-${req.user._id}-${Date.now()}`
    );

    await userModel.findByIdAndUpdate(req.user._id, {
      avatar: uploadedImage.url,
    });

    res.json({
      message: "Avatar updated successfully",
      avatar: uploadedImage.url,
    });

  } catch (err) {
    console.error("Avatar Upload Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
  console.log("req.file:", req.file);  // check if file is received
console.log("req.user:", req.user);  // check if user ID is available

};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerPartner,
  loginPartner,
  logoutPartner,
  getUserProfile,
  changeUserPassword,
  uploadUserAvatar

}