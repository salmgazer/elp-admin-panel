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
    title: 'Measurement Unit',
    dataIndex: 'measurementUnit',
    required: false,
    mainColumn: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Barcode',
    dataIndex: 'barCode',
    required: false,
    mainColumn: true,
    dataType: {
      type: inputTypes.string,
    }
  },
  {
    title: 'Product Category',
    dataIndex: 'productCategoryId',
    isForeignEntity: true,
    resourceKey: 'productCategory',
    required: false,
    mainColumn: true,
    dataType: {
      type: inputTypes.multi,
    }
  },
  {
    title: 'Manufacturer',
    dataIndex: 'manufacturerId',
    isForeignEntity: true,
    resourceKey: 'manufacturer',
    required: false,
    mainColumn: true,
    dataType: {
      type: inputTypes.multi,
    }
  },
  {
    title: 'Brand',
    dataIndex: 'brandId',
    isForeignEntity: true,
    resourceKey: 'brand',
    required: false,
    mainColumn: true,
    dataType: {
      type: inputTypes.multi,
    }
  },
];

export default columns;
