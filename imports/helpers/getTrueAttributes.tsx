import pickBy = require("lodash.pickby");

export function getHavingStringTypeTrueAttributesFromObject(object: object) {
  return pickBy(object, (value: any) => {
    return value === "true";
  });
}
