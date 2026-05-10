import React, { Profiler } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

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

import ShopProfile from '../pages/foodPartner/ShopProfile';

import ProcessingOrder from '../pages/orderpages/ProcessingOrder';
import OrderConfirmation from '../pages/orderpages/OrderConfirmation';
import OrderFailedScreen from '../pages/orderpages/OrderFailed';
import OrderAndPayment from '../pages/payment/OrderAndPayment';
import Order from '../pages/orderpages/Order';
import TrackOrderScreen from '../pages/orderpages/TrackOrderScreen';
import OtpScreen from '../pages/payment/OtpScreen';

const AppRoutes = () => {
    const isAuthenticated = localStorage.getItem("userId");

    return (
        <Router>
            <Routes>
                {/* Redirect based on Auth Status */}
                <Route
                    path="/"
                    element={isAuthenticated ? <Home /> : <Navigate to="/user/login" replace />}
                />

                <Route path="/profile/:id" element={<ShopProfile />} />


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

                <Route path='/order-confirmation/:orderId' element={<OrderConfirmation />} />
                <Route path='/order-failed' element={<OrderFailedScreen />} />

                <Route path='/payment-order' element={<OrderAndPayment />} />
                <Route path="/processing-order/:orderId" element={<ProcessingOrder />} />

                <Route path='/orders' element={<Order />} />
                <Route path='/track-order/:orderId' element={<TrackOrderScreen />} />
                <Route path='/otp/:orderId' element={<OtpScreen />} />


                {/* Auth Routes */}
                <Route
                    path="/user/register"
                    element={!isAuthenticated ? <UserRegister /> : <Navigate to="/" replace />}
                />
                <Route
                    path="/user/login"
                    element={!isAuthenticated ? <UserLogin /> : <Navigate to="/" replace />}
                />
                <Route
                    path="/food-partner/register"
                    element={!isAuthenticated ? <FoodPartnerRegister /> : <Navigate to="/" replace />}
                />
                <Route
                    path="/food-partner/login"
                    element={!isAuthenticated ? <FoodPartnerLogin /> : <Navigate to="/" replace />}
                />
                <Route path='/user/login-first' element={<LoginFirstModal />} />

            </Routes>
        </Router>
    )
}

export default AppRoutes
