//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
import { ObjectId } from "mongodb";
export function isValidName(name) {
  const notContainsNum = [...name].every((char) => {
    if (char.trim() === "") {
      return true;
    } else {
      return isNaN(char);
    }
  });
  return (
    typeof name === "string" &&
    name !== undefined &&
    name !== null &&
    name.trim().length > 0 &&
    name.length >= 2 &&
    name.length <= 25 &&
    notContainsNum
  );
}

export function checkId(id) {
  if (!id) throw "Error: You must provide an id to search for";
  if (typeof id !== "string") throw "Error: id must be a string";
  id = id.trim();
  if (id.length === 0)
    throw "Error: id cannot be an empty string or just spaces";
  if (!ObjectId.isValid(id)) throw "Error: invalid object ID";
  return id;
}