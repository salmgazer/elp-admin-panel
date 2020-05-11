import paths from "../../utilities/paths";

export default {
  resource: "features",
  displayName: "Features",
  primaryKeyName: "id",
  mainColumnName: "name",
  isReady: true,
  isGeneric: true,
  canEdit: true,
  canDelete: true,
  supportPaths: [
    {
      name: 'Subscriptions',
      link: paths.subscriptions
    }
  ],
  showCreatedAt: true,
  showUpdatedAt: true
};
