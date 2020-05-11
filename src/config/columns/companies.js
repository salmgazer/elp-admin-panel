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
    title: 'Business Category',
    dataIndex: 'businessCategoryId',
    isForeignEntity: true,
    resourceKey: 'businessCategory',
    resource: 'business_categories',
    required: false,
    isTableColumn: true,
    dataType: {
      type: inputTypes.multi,
    }
  },
  {
    title: 'Subscription',
    dataIndex: 'subscriptionId',
    isForeignEntity: true,
    resourceKey: 'subscription',
    resource: 'subscriptions',
    cannotEdit: true,
    required: false,
    isTableColumn: true,
    dataType: {
      type: inputTypes.multi,
    }
  },
];

export default columns;
