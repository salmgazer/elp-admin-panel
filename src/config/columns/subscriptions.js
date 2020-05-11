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
    title: 'Number of Branches',
    dataIndex: 'numberOfBranches',
    required: true,
    mainColumn: true,
    defaultSortOrder: 'descend',
    isTableColumn: true,
    isCardColumn: true,
    sortDirections: ['descend', 'ascend'],
    dataType: {
      type: inputTypes.number,
    }
  },
  {
    title: 'Features',
    dataIndex: 'featureIds',
    isForeignEntity: true,
    resourceKey: 'feature',
    resource: 'features',
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
