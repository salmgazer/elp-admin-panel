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
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Business Category',
    dataIndex: 'businessCategoryId',
    isForeignEntity: true,
    resourceKey: 'businessCategory',
    required: false,
    mainColumn: true,
    dataType: {
      type: inputTypes.multi,
    }
  },
];

export default columns;
