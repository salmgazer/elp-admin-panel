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
    title: 'First Name',
    dataIndex: 'firstName',
    required: true,
    mainColumn: true,
    defaultSortOrder: 'descend',
    isTableColumn: true,
    isCardColumn: true,
    sortDirections: ['descend', 'ascend'],
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Other Names',
    dataIndex: 'otherNames',
    required: true,
    defaultSortOrder: 'descend',
    isTableColumn: true,
    isCardColumn: true,
    sortDirections: ['descend', 'ascend'],
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    required: true,
    defaultSortOrder: 'descend',
    isTableColumn: true,
    sortDirections: ['descend', 'ascend'],
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Email',
    dataIndex: 'email',
    defaultSortOrder: 'descend',
    sortDirections: ['descend', 'ascend'],
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Location',
    dataIndex: 'location',
    defaultSortOrder: 'descend',
    sortDirections: ['descend', 'ascend'],
    dataType: {
      type: inputTypes.string,
    }
  },
];

export default columns;
