import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";

export const getOneUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new BadRequest("User not found");
  }
  res.status(StatusCodes.OK).json({ data: user, success: true });
};

export const currentUser = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new BadRequest("User not authenticated");
  }
  res.status(StatusCodes.OK).json({ data: user, success: true });
};

export const updateUser = async (req, res) => {
  const { userId: id } = req.user;
  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new BadRequest("User not found");
  }
  user.password = undefined;
  user.attachCookiesToResponse(res);
  res.status(StatusCodes.OK).json({ data: user, success: true });
};

export const addFriend = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user.userId);

  if (!user) {
    throw new BadRequest("User not found");
  }
  const friend = await User.findById(id);

  if (!friend) {
    throw new BadRequest("Friend not found");
  }
  if (user.friendsList.includes(id)) {
    throw new BadRequest("Already friends");
  }
  user.friendsList.push(id);

  await user.save();
  res.status(StatusCodes.OK).json({ data: user, success: true });
};
export const deleteUser = async () => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new BadRequest("User not found");
  }
  res.status(StatusCodes.OK).json({ success: true, message: "User deleted" });
};
