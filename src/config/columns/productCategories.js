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
    dataType: {
      type: inputTypes.multi,
    }
  },
  {
    title: 'Segment',
    dataIndex: 'productSegmentId',
    isForeignEntity: true,
    resourceKey: 'productSegment',
    resource: 'product_segments',
    required: false,
    isTableColumn: true,
    dataType: {
      type: inputTypes.multi,
    }
  },
];

export default columns;
