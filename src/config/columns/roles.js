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
  },
  {
    title: 'Description',
    dataIndex: 'description',
    required: true,
    mainColumn: true,
    defaultSortOrder: 'descend',
    isTableColumn: true,
    isCardColumn: true,
    sortDirections: ['descend', 'ascend'],
    fullLength: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Permissions',
    dataIndex: 'permissionIds',
    isForeignEntity: true,
    resourceKey: 'permission',
    resource: 'permissions',
    required: false,
    isTableColumn: true,
    hasManyField: true,
    dataType: {
      type: inputTypes.multipleValues,
    }
  },
];

export default columns;

// features
