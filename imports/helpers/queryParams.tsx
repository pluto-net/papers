import * as queryString from "query-string";

export function addOrChangeQueryParams(currentParamsString: string, targetObject: object) {
  const queryParamsObject = queryString.parse(currentParamsString);
  const newQueryParamsObject = { ...queryParamsObject, ...targetObject };

  return queryString.stringify(newQueryParamsObject);
}
