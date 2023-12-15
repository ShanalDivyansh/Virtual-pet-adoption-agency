import { reviews } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { checkId } from "../helpers.js";
import { guardian } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const createReview = async function (
  userId,
  review,
  guardianID,
  rating
) {
  if (
    typeof userId === "undefined" &&
    typeof review === "undefined" &&
    typeof guardianID === "undefined" &&
    typeof rating === "undefined"
  ) {
    throw "Error All fields need to have valid values";
  }
  const usersID = checkId(userId);
  const guardiansID = checkId(guardianID);

  const isRating = typeof rating === "number" && rating >= 0 && rating <= 5;
  if (!isRating) throw "Rating should be a number between 0 and 5.";

  const collectionGuardian = await guardian();
  const getGuardian = await collectionGuardian.findOne({
    _id: new ObjectId(guardiansID),
  });
  if (!getGuardian) throw "Guardian not found";
  const usersCollection = await users();
  const getUser = await usersCollection.findOne({
    _id: new ObjectId(usersID),
  });

  if (!getUser) throw "User not found";
  const reviewsCollection = await reviews();
  const allReviews = await reviewsCollection.find({}).toArray();
  let addReview;
  if (allReviews.length === 0) {
    addReview = await reviewsCollection.insertOne({
      _id: new ObjectId(),
      review,
      rating,
      usersID: new ObjectId(usersID),
      guardianID: new ObjectId(guardiansID),
    });
    if (!addReview.insertedId) throw "Insert failed!";
  } else {
    const reviewExists = allReviews.find((r) => {
      return (
        r.usersID.toString() === usersID.toString() &&
        r.guardianID.toString() === guardiansID.toString()
      );
    });
    console.log(reviewExists);
    if (reviewExists) throw "Review exists.";
    addReview = await reviewsCollection.insertOne({
      _id: new ObjectId(),
      review,
      rating,
      usersID: new ObjectId(usersID),
      guardianID: new ObjectId(guardiansID),
    });
  }
  if (!addReview.insertedId) throw "Insert failed!";
  return { insertedUser: true };
};
export const getGuardianReviews = async function (guardianID) {
  if (typeof guardianID === "undefined")
    throw "Error All fields need to have valid values";
  const id = checkId(guardianID);
  const collection = await reviews();
  const getReviews = await collection
    .aggregate([
      { $match: { guardianID: new ObjectId(id) } },
      {
        $lookup: {
          from: "guardian",
          localField: "guardianID",
          foreignField: "_id",
          as: "guardianInfo",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "usersID",
          foreignField: "_id",
          as: "usersInfo",
        },
      },
    ])
    .toArray();
  console.log(getReviews);
};
export const getUsersReviews = async function (usersID) {
  if (typeof usersID === "undefined")
    throw "Error All fields need to have valid values";
  const id = checkId(usersID);
  const collection = await reviews();
  const getReviews = await collection
    .aggregate([
      { $match: { usersID: new ObjectId(id) } },
      {
        $lookup: {
          from: "guardian",
          localField: "guardianID",
          foreignField: "_id",
          as: "guardianInfo",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "usersID",
          foreignField: "_id",
          as: "usersInfo",
        },
      },
    ])
    .toArray();
  console.log(getReviews);
};

export const getReview = async function (reviewId) {
  const id = checkId(reviewId);
  const collection = await reviews();
  const review = await collection
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "usersID",
          foreignField: "_id",
          as: "usersInfo",
        },
      },
      {
        $lookup: {
          from: "guardian",
          localField: "guardianID",
          foreignField: "_id",
          as: "guardianInfo",
        },
      },
    ])
    .toArray();
  if (!review) throw "Error: Review not found.";
  return review;
};

export const updateReview = async function (
  userId,
  guardianID,
  review,
  rating
) {
  const usersId = checkId(userId);
  const guardiansID = checkId(guardianID);
  const collection = await reviews();
  const updateReview = await collection.findOneAndUpdate(
    { usersID: new ObjectId(usersId), guardianID: new ObjectId(guardiansID) },
    {
      $set: {
        review,
        rating,
      },
    },
    { returnDocument: "after" }
  );
  if (!updateReview) throw "Error: Update failed";
};
