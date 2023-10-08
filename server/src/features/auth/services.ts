import bcrypt from "bcrypt";
import User from "./model/user";
import { IPostSignup, IPostLogin } from "./interface";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
require("dotenv").config();

const admin = {
  name: "Rishav",
  email: "rishav123@gmail.com",
  password: "rishav@123",
  phone:"123456789",
  isAdmin: true,
};

export class AuthServices {
  static postSignup = async (body: IPostSignup) => {
    const { name,image, email,phone, password, password_confirmation } = body;
    const user = await User.findOne({ email: email });
    if (user) {
      return {
        code: 409,
        status: "failed",
        message: "Email already exists",
      };
    } else {
      if (!name || !email || !phone || !password || !password_confirmation) {
        return {
          code: 400,
          status: "failed",
          message: "All fields are required",
        };
      } else {
        if (password === password_confirmation) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const document = new User({
              name: name,
              image:image,
              email: email,
              phone:phone,
              password: hashPassword,
            });
            await document.save();
            return {
              code: 200,
              status: "success",
              message: "User registered successfully",
            };
          } catch (error) {
            return {
              code: 400,
              status: "failed",
              message: "unable to register",
            };
          }
        } else {
          return {
            code: 400,
            status: "failed",
            message: "password and confirm password doesn't match",
          };
        }
      }
    }
  };

  static postLogin = async (body: IPostLogin) => {
    try {
      const { email, password } = body;
      if (email && password) {
        const user = await User.findOne({ email: email });
        const id = user?._id.toString();

        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);

          if (isMatch) {
            const payload = { user_id: id, email: user.email };

            const token = jwt.sign(
              payload,
              process.env.JWT_SECRET_KEY as string,
              { expiresIn: "5d" }
            );

            const data = {
              user_id:id,
              image:user.image,
              name: user.name,
              email: user.email,
              phone:user.phone,
              isAdmin: user.isAdmin,
              token: token,
            };
            
            return {
              code: 200,
              status: "success",
              message: "User Login Success",
              data: data,
            };
          } else {
            return {
              code: 400,
              status: "failed",
              message: "Email or Password is not valid",
            };
          }
        } else if (email === admin.email && password === admin.password) {
          const payload = { email: admin.email };

          const token = jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: "5d" }
          );

          return {
            code: 200,
            status: "success",
            message: "Admin Login Success",
            data: { ...admin, token },
          };
        } else {
          return {
            code: 409,
            status: "failed",
            message: "You are not registered",
          };
        }
      } else {
        return {
          code: 400,
          status: "failed",
          message: "All fields are required",
        };
      }
    } catch (error) {
      return {
        code: 400,
        status: "failed",
        message: "Unable to login",
      };
    }
  };
}
