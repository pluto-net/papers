import * as qs from "qs";

export function addOrChangeQueryParams(currentParamsString: string, targetObject: object, removeKeys?: string[]) {
  const targetString = currentParamsString[0] === "?" ? currentParamsString.slice(1) : currentParamsString;
  const queryParamsObject = qs.parse(targetString);
  const newQueryParamsObject = { ...queryParamsObject, ...targetObject };

  if (removeKeys) {
    removeKeys.forEach(key => {
      delete newQueryParamsObject[key];
    });
  }

  return qs.stringify(newQueryParamsObject);
}
