import paths from "../../utilities/paths";

export default {
  resource: "roles",
  displayName: "Roles",
  primaryKeyName: "id",
  mainColumnName: "name",
  isReady: true,
  isGeneric: true,
  canEdit: true,
  supportPaths: [
    {
      name: 'Permissions',
      link: paths.permissions
    }
  ],
  showCreatedAt: true,
  showUpdatedAt: true,
  hasMany: [
    'permissions'
  ]
};
