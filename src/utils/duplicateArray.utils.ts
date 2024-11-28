/**
* This function checks if any item in the array are repeated.
* @param inputArray {any[]} array to check for dublicates
*
* @returns {boolean} Boolean value to indicate if the item is dublicated.
*/
export function isDuplicateInArray(inputArray: any[]): boolean {
  const duplicates = inputArray.filter((item, index) => inputArray.indexOf(item) !== index);
  const dubArr = Array.from(new Set(duplicates));
  if (dubArr.length >= 1) {
    return true;
  } else {
    return false;
  }
}


