import React from "react";
import inputTypes from "../inputTypes";
import product_categories from "../resources/product_categories";
import product_segments from "../resources/product_segments";
import product_segment_entries from "../resources/product_segment_entries";
import imagePath from "../../assets/img/placeholder.png";

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
    title: '',
    dataIndex: 'picture',
    required: false,
    isTableColumn: true,
    render: () => <img  alt={''} style={{ width: '40px' }} src={imagePath} />,
    dataType: {
      type: inputTypes.picture,
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
    title: 'Product Category',
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
  {
    title: 'Product Segments',
    dataIndex: 'productSegmentIds',
    isForeignEntity: true,
    resourceKey: 'productSegment',
    resource: 'product_segments',
    primaryResourceConfig: product_categories,
    resourceConfig: product_segments,
    childResourceConfig: product_segment_entries,
    required: false,
    isTableColumn: true,
    dataType: {
      type: inputTypes.dynamicMultiWithChildren,
      description: `This is the case where a field is dynamic based on each entry, and has multiple children`
    }
  },
];

export default columns;
