import inputTypes from "../inputTypes";

const columns = [
  {
    title: 'First name',
    dataIndex: 'firstName',
    key: 'firstName',
    mainColumn: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Other Names',
    dataIndex: 'otherNames',
    key: 'otherNames',
    mainColumn: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
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
    }
  },
];

export default columns;
