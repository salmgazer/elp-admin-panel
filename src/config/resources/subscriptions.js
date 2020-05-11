import paths from "../../utilities/paths";

export default {
  resource: "subscriptions",
  displayName: "Subscriptions",
  primaryKeyName: "id",
  mainColumnName: "name",
  isReady: true,
  isGeneric: true,
  canEdit: true,
  supportPaths: [
    {
      name: 'Features',
      link: paths.features
    }
  ],
  showCreatedAt: true,
  showUpdatedAt: true,
  hasMany: [
    'features'
  ]
};
