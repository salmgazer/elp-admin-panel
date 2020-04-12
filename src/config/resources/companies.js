import branches from "./branches";

export default {
  resource: "companies",
  primaryKeyName: "id",
  displayName: "Companies",
  displayColumns: ["name"],
  mainColumnName: "name",
  isReady: true,
  isGeneric: true,
  canEdit: true,
  useHashLink: true,
  showCreatedAt: true,
  showUpdatedAt: true,
  child: branches
};
