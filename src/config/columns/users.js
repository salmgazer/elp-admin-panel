import inputTypes from "../inputTypes";

const columns = [
  {
    title: 'First name',
    dataIndex: 'firstName',
    key: 'firstName',
    mainColumn: true,
    isTableColumn: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Other Names',
    dataIndex: 'otherNames',
    key: 'otherNames',
    isTableColumn: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
    isTableColumn: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    isTableColumn: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    dataType: {
      type: inputTypes.multi,
      values: ['male', 'female']
    }
  },
];

export default columns;
