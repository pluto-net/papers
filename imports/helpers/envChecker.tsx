export default class EnvChecker {
  public static isDev(): boolean {
    return (
      window.location.hostname &&
      (window.location.hostname.includes("localhost") || window.location.hostname.includes("lvh.me"))
    );
  }
}
