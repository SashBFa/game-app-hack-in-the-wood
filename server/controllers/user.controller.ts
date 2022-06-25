import { Request, Response } from "express";
import UserModel from "./../models/user.model";
import { Types } from "mongoose";
import { production } from "../data/production";
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find().select("-password");
  res.status(200).send(users);
};

export const userInfo = (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  UserModel.findById(req.params.id, (err: string, docs: string) => {
    !err ? res.status(200).send(docs) : res.status(400).send({ message: err });
  }).select("-password");
};

export const updateUser = async (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    )
      .then((docs) => {
        res.send(docs);
      })
      .catch((err) => res.status(400).send({ message: err }));
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await UserModel.deleteOne({ _id: req.params.id }).exec();
    res.status(200).send({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

export const follow = async (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  } else if (!Types.ObjectId.isValid(req.body.idToFollow)) {
    return res.status(400).send("Follow unknown : " + req.body.idToFollow);
  }
  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
    )
      .then((docs) => res.status(200).json(docs))
      .catch((err) => res.status(400).send({ message: err }));

    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true }
    )
      .then()
      .catch((err) => res.status(400).send({ message: err }));
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

export const unfollow = async (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  } else if (!Types.ObjectId.isValid(req.body.idToUnfollow)) {
    return res.status(400).send("Unfollow unknown : " + req.body.idToUnfollow);
  }
  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true }
    )
      .then((docs) => res.status(200).json(docs))
      .catch((err) => res.status(400).send({ message: err }));

    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true }
    )
      .then()
      .catch((err) => res.status(400).send({ message: err }));
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

export const addFriend = async (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  } else if (!Types.ObjectId.isValid(req.params.idToFollow)) {
    return res.status(400).send("Follow unknown : " + req.params.idToFollow);
  }
  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { friendRequestSend: req.params.idToFollow } },
      { new: true, upsert: true }
    )
      .then((docs) => res.status(200).json(docs))
      .catch((err) => res.status(400).send({ message: err }));

    await UserModel.findByIdAndUpdate(
      req.params.idToFollow,
      { $addToSet: { friendRequestReceived: req.params.id } },
      { new: true, upsert: true }
    )
      .then()
      .catch((err) => res.status(400).send({ message: err }));
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

export const acceptFriend = async (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  } else if (!Types.ObjectId.isValid(req.params.idToAccept)) {
    return res.status(400).send("Follow unknown : " + req.params.idToAccept);
  }
  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { friendRequestSend: req.params.idToAccept } },
    )
      .then((docs) => res.status(200).json(docs))
      .catch((err) => res.status(400).send({ message: err }));

    await UserModel.findByIdAndUpdate(
      req.params.idToAccept,
      { $pull: { friendRequestReceived: req.params.id } },
      { new: true, upsert: true }
    )
      .then()
      .catch((err) => res.status(400).send({ message: err }));

    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { friends: req.params.idToAccept } },
      { new: true, upsert: true }
    )
      .then()
      .catch((err) => res.status(400).send({ message: err }));

    await UserModel.findByIdAndUpdate(
      req.params.idToAccept,
      { $addToSet: { friends: req.params.id } },
      { new: true, upsert: true }
    )
      .then()
      .catch((err) => res.status(400).send({ message: err }));
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

export const deleteRequestFriend = async (req: Request, res: Response) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  } else if (!Types.ObjectId.isValid(req.params.idToAccept)) {
    return res.status(400).send("Follow unknown : " + req.params.idToAccept);
  }
  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { friendRequestSend: req.params.idToAccept } },
    )
      .then((docs) => res.status(200).json(docs))
      .catch((err) => res.status(400).send({ message: err }));

    await UserModel.findByIdAndUpdate(
      req.params.idToAccept,
      { $pull: { friendRequestReceived: req.params.id } },
      { new: true, upsert: true }
    )
      .then()
      .catch((err) => res.status(400).send({ message: err }));

  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

export const addEnergy = async (req: Request, res: Response) => {
  (await UserModel.find()).forEach(async element => {
    let theDate = new Date().getHours();
    try{
      console.log(element.energy)
      if(element.energy >= 11){
        console.log("Max")
      } else {
        production.forEach(pro => {
          if(theDate == pro.hours){
            if(pro.pick >= 0.50 ){
              element.updateOne({$inc: {energy: +1}}).exec();
              console.log("+1")
            } else if(pro.pick >= 0.80){
              element.updateOne({$inc: {energy: +2}}).exec();
              console.log("+2")
            }
          }
        })
      }
    } catch(err){
      return console.log(err)
    }
  });
}

setInterval(addEnergy, 1000 * 60 * 3)