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

export function checkState(state) {

  const statesUS = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
      'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
      'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
      'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

  return statesUS.includes(state);
}

export function checkZip(zip) {

  const zipFormat = /^\d{5}$/;

  return zipFormat.test(zip);
}

export function array1ContainsAllElementsOfArray2(array1, array2) {
  return array1.every(element => array2.includes(element));
}
