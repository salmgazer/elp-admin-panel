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
    defaultSortOrder: 'descend',
    isTableColumn: true,
    isCardColumn: true,
    sortDirections: ['descend', 'ascend'],
    dataType: {
      type: inputTypes.string,
    }
  }
];

export default columns;

