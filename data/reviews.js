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

  review = review.trim();
  rating = rating.trim();

  if (!review || review === " ")
  throw "Review Cannot Be Empty";

  if (!rating || rating === " ")
  throw "Rating Cannot Be Empty";
  
  const isRating = typeof rating === "number" && rating >= 0 && rating <= 5;
  if (!isRating) throw "Rating should be a number between 0 and 5.";

  const isReview = typeof review === "string" && review.length <= 3;
  if (!isReview) throw "Review should be a string and not less than 3 characters";

  const collection = await reviews();
  const addReview = await collection.insertOne({
    _id: new ObjectId(),
    review,
    rating,
    usersID: new ObjectId(usersID),
    guardianID: new ObjectId(guardiansID),
  });
  if (!addReview.insertedId) throw "Insert failed!";

  const collectionGuardian = await guardian();

  const getGuardian = await collectionGuardian.findOne({
    _id: new ObjectId(guardiansID),
  });
  if (!getGuardian) throw "User not found";
  console.log(getGuardian);
  const isReviewExisting = getGuardian.reviews.every((review) => {
    return review === addReview.insertedId;
  });
  if (isReviewExisting) throw "Error review already exists.";
  const addGuardianReview = await collectionGuardian.findOneAndUpdate(
    { _id: new ObjectId(usersID) },
    {
      $set: {
        review: [...getGuardian.reviews, petID],
      },
    },
    { returnDocument: "after" }
  );
  if (!updateInfo) throw "Error: Update failed";

  return { insertedUser: true, addGuardianReview };
};
export const getReview = async function (guardianID) {
  if (typeof guardianID === "undefined")
    throw "Error All fields need to have valid values";
  const collection = await reviews();

  const getReviews = await collection
    .aggregate([
      //   { $match: { guardianID } },
      {
        $lookup: {
          from: "guardian",
          localField: "guardianID",
          foreignField: "_id",
          as: "guardianInfo",
        },
      },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "userID",
      //       foreignField: "_id",
      //       as: "",
      //     },
      //   },
    ])
    .toArray();
  console.log(getReviews[0].guardianInfo);
};
