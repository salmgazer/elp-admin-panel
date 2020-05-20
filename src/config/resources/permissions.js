import paths from "../../utilities/paths";

export default {
  resource: "permissions",
  displayName: "Permissions",
  primaryKeyName: "id",
  mainColumnName: "name",
  isReady: true,
  isGeneric: true,
  canEdit: true,
  canDelete: true,
  supportPaths: [
    {
      name: 'Roles',
      link: paths.roles
    }
  ],
  showCreatedAt: true,
  showUpdatedAt: true
};
