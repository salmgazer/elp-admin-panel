import companies from "./companies";

export default {
  resource: "users",
  primaryKeyName: "userId",
  displayName: "Accounts",
  displayColumns: ["firstName", "otherNames"],
  mainColumnName: "firstName",
  isReady: true,
  isGeneric: true,
  canEdit: true,
  showCreatedAt: true,
  showUpdatedAt: true,
  child: companies
}
