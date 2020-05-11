import inputTypes from "../inputTypes";

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    required: true,
    dataType: {
      type: inputTypes.string,
      primaryKey: true
    }
  },
  {
    title: 'Name',
    dataIndex: 'name',
    required: true,
    mainColumn: true,
    isTableColumn: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Parent',
    dataIndex: 'parentId',
    required: true,
    isTableColumn: true,
    showParentsOnly: true,
    dataType: {
      type: inputTypes.multi,
    }
  },
  {
    title: 'Product Segments',
    dataIndex: 'productSegmentIds',
    notAccessibleToParent: true,
    isForeignEntity: true,
    resourceKey: 'productSegment',
    resource: 'product_segments',
    required: false,
    isTableColumn: true,
    hasManyField: true,
    dataType: {
      type: inputTypes.multipleValues,
    }
  },
  {
    title: 'Measurement Unit',
    dataIndex: 'measurementUnitId',
    isForeignEntity: true,
    resourceKey: 'measurementUnit',
    resource: 'measurement_units',
    required: false,
    isTableColumn: true,
    dataType: {
      type: inputTypes.multi,
    }
  },
];

export default columns;
