import React, { Profiler } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import UserRegister from '../pages/auth/UserRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages//auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import LoginFirstModal from '../components/LoginFirstModal';
import Home from '../pages/general/homePage';
import FoodPartnerProfile from '../pages/foodPartner/FoodPartnerProfile';

import UploadNewFood from '../pages/foodPartner/UploadNewFood';
import Cart from '../pages/general/Cart'

import UserProfile from '../pages/profile/UserProfile';
import ChangePassword from '../pages/profile/ChangePassword';
import Notifications from '../pages/profile/NotificationPage';

import Profile from '../pages/foodPartner/Profile';

import ProcessingOrder from '../pages/orderpages/ProcessingOrder';
import OrderConfirmation from '../pages/orderpages/OrderConfirmation';
import OrderFailedScreen from '../pages/orderpages/OrderFailed';
import OrderAndPayment from '../pages/payment/OrderAndPayment';
import Order from '../pages/orderpages/Order';
import TrackOrderScreen from '../pages/orderpages/TrackOrderScreen';
import OtpScreen from '../pages/payment/OtpScreen';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile/:id" element={<Profile />} />
               

                {/* Cart Route */}
                <Route path="/cart" element={<Cart />} />

                {/* Food Partner Routes */}
                <Route path="/food-partner/:id" element={<FoodPartnerProfile />} />
                <Route path="/upload-new-food" element={<UploadNewFood />} />
                <Route path="/edit-food/:id" element={<UploadNewFood editMode={true} />} />

                {/* User Profile */}
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="/user/change-password" element={<ChangePassword />} />
                <Route path="/user/notifications" element={<Notifications />} />
            

                {/*Order Pages */}
               
                <Route path='/order-confirmation' element={<OrderConfirmation />} />
                <Route path='/order-failed' element={<OrderFailedScreen />} />

                <Route path='/payment-order' element={<OrderAndPayment />} />
               <Route path="/processing-order/:orderId" element={<ProcessingOrder />} />

                <Route path='/orders' element={<Order />} />
                <Route path='/track-order' element={<TrackOrderScreen />} />
                <Route path='/otp/:orderId' element={<OtpScreen />}/>


                {/* Auth Routes */}
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                <Route path='/user/login-first' element={<LoginFirstModal />} />
                
            </Routes>
        </Router>
    )
}

export default AppRoutes
