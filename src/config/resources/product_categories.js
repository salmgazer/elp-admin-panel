export default {
  resource: "product_categories",
  hasParent: true,
  displayName: "Product Categories",
  primaryKeyName: "id",
  foreignKeyName: "productCategoryId",
  mainColumnName: "name",
  isReady: true,
  isGeneric: true,
  parentName: "Parent",
  parentType: "string",
  canEdit: true,
  canDelete: true,
  showCreatedAt: true,
  showUpdatedAt: true,
  hasMany: [
    'product_segments'
  ]
}
