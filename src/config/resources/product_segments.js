import product_segment_entries from "./product_segment_entries";

export default {
  resource: "product_segments",
  displayName: "Product Segments",
  primaryKeyName: "id",
  foreignKeyName: "productSegmentId",
  mainColumnName: "name",
  displayColumns: ["name"],
  isReady: true,
  isGeneric: true,
  canEdit: true,
  canDelete: true,
  showCreatedAt: true,
  showUpdatedAt: true,
  child: product_segment_entries
};
