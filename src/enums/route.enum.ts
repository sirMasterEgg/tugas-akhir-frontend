export enum RouteEnum {
  INDEX = "/",
  LOGIN = "/login",
  REGISTER = "/register",
  HOME = "/home",
  VERIFICATION = "/verify",
  FORGOT_PASSWORD = "/forgot-password",
  RESET_PASSWORD = "/reset-password",
  NOTIFICATION = "/notification",
  INBOX = "/inbox",
  PROFILE = "/user",
  OTHER_USER_PROFILE = "/user/:username",
  SETTINGS = "/settings",
  GROUP_DETAILS = "/group/:identifier",

  ADMIN_HOME = "/admin",
  REPORT_MANAGEMENT = "/admin/report",
  MANAGE_ADMIN = "/admin/manager",
}
