import inputTypes from "../inputTypes";
const manufacturersResource = require('../resources').manufacturers;

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    required: true,
    dataType: {
      type: inputTypes.string,
      resource: manufacturersResource,
      primaryKey: true
    }
  },
  {
    title: 'Name',
    dataIndex: 'name',
    required: true,
    mainColumn: true,
    dataType: {
      type: inputTypes.string,
      resource: manufacturersResource,
    }
  },
];

export default columns;
