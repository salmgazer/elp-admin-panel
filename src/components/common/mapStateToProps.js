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
      customers
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
      customers
    };
}
