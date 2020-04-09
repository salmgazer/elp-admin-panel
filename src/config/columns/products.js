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
    title: 'Measurement Unit',
    dataIndex: 'measurementUnit',
    required: false,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Barcode',
    dataIndex: 'barCode',
    required: false,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Category',
    dataIndex: 'productCategoryId',
    isForeignEntity: true,
    resourceKey: 'productCategory',
    resource: 'product_categories',
    required: false,
    isTableColumn: true,
    dataType: {
      type: inputTypes.multi,
    }
  },
  {
    title: 'Manufacturer',
    dataIndex: 'manufacturerId',
    isForeignEntity: true,
    resourceKey: 'manufacturer',
    resource: 'manufacturers',
    required: false,
    isTableColumn: true,
    dataType: {
      type: inputTypes.multi,
    }
  },
  {
    title: 'Brand',
    dataIndex: 'brandId',
    isForeignEntity: true,
    resourceKey: 'brand',
    resource: 'brands',
    required: false,
    isTableColumn: true,
    dataType: {
      type: inputTypes.multi,
    }
  },
];

export default columns;
