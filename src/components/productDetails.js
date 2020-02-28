import React, {Component} from 'react';
import { Drawer, Skeleton , Badge} from 'antd';
import styles from '../assets/css/productDetail.module.scss';



const ProductDetails = ({ productId , visible, onClose }) => {
    //console.log(productId);

    return (

        <Drawer
            destroyOnClose
            title={productId.name}
            visible={visible}
            width={450}
            onClose={onClose}
        >



                    <div style={{padding: 10}}>
                        <img src={'https://elparah.store/admin/upload/no_image.png'} className={styles.img}></img>
                        <br /><br />
                        <p className={styles.p}>Product name : <span className={styles.chips}>{productId.name}</span></p>
    <p className={styles.p}>Nickname : <span className={styles.chips}>{productId.description}</span></p>
    <p className={styles.p}>Barcode : <span className={styles.chips}>{productId.barcode}</span></p>
    <p className={styles.p}>Package : <span className={styles.chips}></span></p>
    <p className={styles.p}>Category : <span className={styles.chips}>{productId.productCategoryId}</span></p>
    <p className={styles.p}>Manufacturer : <span className={styles.chips}>{productId.manufacturerId}</span></p>
    <p className={styles.p}>Brand : <span className={styles.chips}>{productId.brandId}</span></p>
    <p className={styles.p}>Segments : <span className={styles.chips}></span></p>
    </div>

        </Drawer>


    )
}

export default ProductDetails;