export default function mapStateToProps(state) {
    const {
      brands,
      companies,
      branches,
      products,
      manufacturers,
      product_categories,
      business_categories,
      users,
      clients,
      product_segments,
      product_segment_entries,
      customers,
      measurement_units,
      features,
      subscriptions,
      roles,
      permissions,
      cools
    } = state;

    return {
      brands,
      companies,
      branches,
      products,
      manufacturers,
      product_categories,
      business_categories,
      users,
      clients,
      product_segments,
      product_segment_entries,
      customers,
      measurement_units,
      features,
      subscriptions,
      roles,
      permissions,
      cools
    };
}
