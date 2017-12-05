import * as queryString from "query-string";

export function addOrChangeQueryParams(currentParamsString: string, targetObject: object, removeKeys?: string[]) {
  const queryParamsObject = queryString.parse(currentParamsString);
  const newQueryParamsObject = { ...queryParamsObject, ...targetObject };

  if (removeKeys) {
    removeKeys.forEach(key => {
      delete newQueryParamsObject[key];
    });
  }

  return queryString.stringify(newQueryParamsObject);
}
