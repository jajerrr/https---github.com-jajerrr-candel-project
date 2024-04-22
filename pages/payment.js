import React, { useState, useEffect } from 'react'; 
import { useRouter } from 'next/router'; 
import Head from 'next/head'; 
import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer'; 
import styles from '../styles/payment.module.css'; 


const PageNav = () => (  
    <nav className={styles.navBar}>  
        <div className={styles.bar}>  
            <a href="/cart" className={styles.linkCart}>  
                <p>Cart</p>  
            </a>  
            <svg className={styles.svgIcon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">  
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1" />  
            </svg>  
                
            <a href="/shipping" className={styles.linkShipping}>  
                <p>Shipping</p>  
            </a>  
            <svg className={styles.svgIcon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">  
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1" />  
            </svg>  

            <a href="/payment" className={styles.linkPayment}>  
                <p>Payment</p>  
            </a>  
        </div>  
    </nav>  

);  

// ฟังก์ชันหลักของ PaymentPage

const PaymentPage = () => {
    const [shippingCost, setShippingCost] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [sender, setSender] = useState({
        contact: '',
        name: '',
        surname: '',
        address: '',
        city: '',
        province: '',
        country: '',
        postalCode: '',
        selectedMethod: '',
    });
    const [total, setTotal] = useState(0);

    const router = useRouter();
    const query = router.query;

    // ใช้ `useEffect` เพื่ออ่านข้อมูลจาก `query` เมื่อหน้าเพจโหลดสำเร็จ
    useEffect(() => {
        if (router.isReady) {
            // อ่านข้อมูลจาก `query`
            try {
                const productsFromQuery = query.products ? JSON.parse(query.products) : [];
                setCartItems(productsFromQuery);
                setQuantities(productsFromQuery.map(item => item.productQuantity || 1));

                // ตั้งค่า sender จาก `query`
                setSender({
                    contact: query.contact || '',
                    name: query.name || '',
                    surname: query.surname || '',
                    address: query.address || '',
                    city: query.city || '',
                    province: query.province || '',
                    country: query.country || '',
                    postalCode: query.postalCode || '',
                    selectedMethod: query.selectedMethod || '',
                });

                // ตั้งค่า total, shippingCost, และ selectedPaymentMethod จาก query
                setTotal(parseFloat(query.total) || 0);
                setShippingCost(parseFloat(query.shippingCost) || 0);
                setSelectedPaymentMethod(query.paymentMethod || '');
            } catch (error) {
                console.error('Error parsing query data:', error);
            }
        }
    }, [router.isReady, query]);

    // ใช้ `useEffect` เพื่อบันทึก `subtotal` และ `shippingCost` ลงใน `localStorage`
    useEffect(() => {
        // คำนวณ subtotal
        const subtotal = cartItems.reduce((sum, item, index) => {
            return sum + (parseFloat(item.productPrice) * quantities[index]);
        }, 0);

        // บันทึก `subtotal` และ `shippingCost` ลงใน `localStorage`
        localStorage.setItem('subtotal', subtotal.toFixed(2));
        localStorage.setItem('shippingCost', shippingCost.toFixed(2));

        // อัปเดตค่า `total`
        setTotal(subtotal);
    }, [cartItems, quantities, shippingCost]);

    // จัดการการเปลี่ยนแปลงของ sender
    const handleSenderChange = (event) => {
        const { name, value } = event.target;
        setSender((prevSender) => ({
            ...prevSender,
            [name]: value,
        }));
    };

    // จัดการการเปลี่ยนแปลงของ selectedPaymentMethod
    const handleMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    // การจัดรูปแบบข้อมูล cartData สำหรับการแสดงใน PaymentPage
    const cartData = cartItems.map((item, index) => {
        const productPrice = parseFloat(item.productPrice) || 0;
        const formattedPrice = productPrice.toFixed(2);

        return {
            productImg: item.productImg || '', // จัดการกรณีที่ productImg เป็นค่า undefined หรือ null
            productName: item.productName || '', // จัดการกรณีที่ productName เป็นค่า undefined หรือ null
            productQuantity: quantities[index],
            productPrice: formattedPrice,
        };
    });
    return (
        <>
            <Head>
                <title>Payment</title>
            </Head>
            <Navbar />
            <PageNav />

            <div className={`${styles.container} mx-auto mt-10 px-4 md:px-0`}>
                <div className={styles.flexContainer}>
                    {/* Payment Box */}
                    <div className={styles.paymentBox}>
                        {/* Contact Information */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            
                            <span className={styles.infoLabel}>Contact: <span className={styles.email}>{sender.contact}</span></span>

                            <a href={`/shipping?name=${sender.name}&surname=${sender.surname}&address=${sender.address}&city=${sender.city}&province=${sender.province}&country=${sender.country}&postalCode=${sender.postalCode}&products=${encodeURIComponent(JSON.stringify(cartItems))}&method=${sender.selectedMethod}`}>
                                <p className={styles.edit}>Edit</p>
                            </a>

                        </div>

                        <hr className={styles.separator} />


                        {/* Shipping Information */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    
                                <div>
                                <span className={styles.infoLabel}>Ship to:</span> 
                                <span className={styles.nameAndSurname}>{`${sender.name} ${sender.surname}`}</span><br />

                                    <div className={styles.inputAdd}>
                                        {sender.address}<br />
                                        {sender.city}<br />
                                        {`${sender.province}, ${sender.postalCode}`}<br />
                                        
                                    </div>
                                </div>
                                <a href={`/shipping?contact=${sender.contact}&products=${encodeURIComponent(JSON.stringify(cartItems))}&method=${sender.selectedMethod}`}>
                                    <p className={styles.edit}>Edit</p>
                                </a>
                            
                        </div>

                        <hr className={styles.separator} />

                        {/* Shipping Method */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className={styles.infoLabel}>
                                Method: <span className={styles.inputShipping}>{sender.selectedMethod}</span>
                            </span>
                            <a href={`/shipping?method=${sender.selectedMethod}&contact=${sender.contact}&name=${sender.name}&surname=${sender.surname}&address=${sender.address}&city=${sender.city}&province=${sender.province}&country=${sender.country}&postalCode=${sender.postalCode}&products=${encodeURIComponent(JSON.stringify(cartItems))}`}>
                                <p className={styles.edit}>Edit</p>
                            </a>
                        </div>
                    </div>

                    {/* Coupon Container */}
                    <div className={styles.couponContainer}>
                        <form className={styles.couponBox}>
                            <input
                                type="text"
                                placeholder=" Coupon Code"
                                className={styles.textCoupon}
                                required
                            />
                            <button type="submit" className={styles.couponButton}>Add Code</button>
                        </form>
                    </div>

                    {/* Payment Method */}
                    {/*<h2 className={styles.paymentMethod}>Payment Method</h2>
                  
                    <div className={styles.paymentMethodBox} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className={styles.headBox}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.iconCredit}>
                                <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                                <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                            </svg>
                            <h3 className="text-lg font-bold">Credit Card</h3>
                        </div>




                        {/* กล่องสำหรับการกรอกข้อมูล Card Number 
                        <form className={styles.cardNumBox}>
                            <div className={styles.inputWrapper}> {/* กล่องห่อ 
                                <input
                                    name="cardnumber"
                                    value={sender.cardnumber}
                                    onChange={handleSenderChange}
                                    placeholder=" Card Number"
                                    className={styles.textName}
                                    required
                                />
                                * ไอคอนที่ขวาของ input *
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.iconcardnum}>
                                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </form>



                         กล่องสำหรับการกรอกข้อมูล Holder Name 
                        <form className={styles.holderNameBox}>
                            <input
                                name="holdername"
                                value={sender.holdername}
                                onChange={handleSenderChange}
                                placeholder=" Holder Name"
                                className={styles.textName}
                                required
                            />
                        </form>

                        * กล่องสำหรับการกรอกข้อมูล Expiration และ CVV *
                        <form className={styles.cvvBox}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    name="expiration"
                                    value={sender.expiration}
                                    onChange={handleSenderChange}
                                    placeholder=" Expiration (MM/YY)"
                                    className={styles.textName}
                                    required
                                />
                                * Wrapper สำหรับ input CVV และไอคอน *
                                <div className={styles.inputWrapper}>
                                    <input
                                        name="cvv"
                                        value={sender.cvv}
                                        onChange={handleSenderChange}
                                        placeholder=" CVV"
                                        className={styles.textName}
                                        required
                                    />
                                    * ไอคอน SVG *
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.iconcvv}>
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </form>

                    </div> */}


                    {/* Products Information */}
                    <h2 className={styles.product}>Products</h2>
                    {cartData.map((product, index) => (
                        
                        <div key={index}>
                            <div className={styles.productBox}>
                                <span className={styles.imgProduct}>
                                    <img src={product.productImg} alt={product.productName} />
                                </span>
                                <div>
                                    <h2><span className={styles.infoLabels}> </span>{product.productName}</h2>
                                    <h3><span className={styles.infoQuantity}>Quantity: </span>{product.productQuantity}</h3>
                                </div>
                                <h3 className={styles.productPrice}>
                                    THB {parseFloat(product.productPrice).toFixed(2)}
                                </h3>
                            </div>
                            {index !== cartItems.length - 1 && (
                                <hr style={{ width: '75%', border: '1px solid rgba(86, 178, 128, 0.5)' }} />
                            )}
                        </div>
                    ))}


                <hr className={styles.separator} />

                    <div className={styles.priceDetail}>
                        <div className={styles.priceRow}>
                            <span className={styles.label}>Subtotal</span>
                            <span className={styles.value}>THB {total.toFixed(2)}</span>
                        </div>

                        <div className={styles.priceRow}>
                            <span className={styles.label}>Shipping</span>
                            <span className={styles.value}>THB {shippingCost.toFixed(2)}</span>
                        </div>

                        <h2 className={styles.totalRow}>
                            <span className={styles.labelTotal}>Total</span>
                            <span className={styles.valueTotal}>THB {(total +  shippingCost).toFixed(2)}</span>
                        </h2>
                    </div>

                    <div className={styles.backAndPayButtons}>
                       
                        <a href={`/shipping?method=${sender.selectedMethod}&contact=${sender.contact}&name=${sender.name}&surname=${sender.surname}&address=${sender.address}&city=${sender.city}&province=${sender.province}&country=${sender.country}&postalCode=${sender.postalCode}&products=${encodeURIComponent(JSON.stringify(cartItems))}`} className="{styles.backButton}">
                            <h3 className={styles.back}>Back to detail</h3>
                        </a>
                        <a href="/confirm">
                            <button className={styles.payButton}>Pay Now</button>
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PaymentPage;