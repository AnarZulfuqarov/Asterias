import { useState } from 'react';
import Cookies from 'js-cookie';
import './index.scss';
import { useNavigate } from "react-router-dom";
import { usePostAdminLoginMutation } from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import star from "../../../assets/Mask group.svg";
import starBack from "../../../assets/starBack.png";
import login from "../../../assets/Login12.png";

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    const [postAdminLogin] = usePostAdminLoginMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true when request starts
        try {
            const response = await postAdminLogin({ email, password }).unwrap();
            showToast("Giriş uğurlu oldu !", "success");
            setTimeout(() => navigate("/admin/services"), 2000);
            if (response?.statusCode === 200) {
                const token = response?.data?.token;
                console.log(response?.data?.token);
                const expireDate = new Date(response.data.expireDate);
                Cookies.set('asteriasToken', token, {
                    expires: 1,
                });
            } else {
                Cookies.set('asteriasToken', 'null');
            }
        } catch {
            alert('Giriş zamanı xəta baş verdi:');
        } finally {
            setIsLoading(false); // Reset loading state when request completes
        }
    };

    return (
        <div className="login-panel">
            <div className="login-form">
                <div className="title">
                    <h1>Sistemə daxil olun</h1>
                    <p>Sistemdəki funksiyalara və məlumatlara çıxış əldə etmək üçün aşağıdakı formanı istifadə edərək hesabınıza daxil olun.</p>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Emailinizi daxil edin"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Şifrə</label>
                        <input
                            type="password"
                            placeholder="Şifrənizi daxil edin"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Giriş et'}
                    </button>
                </form>
            </div>

            <img src={star} className="star" alt="star" />
            <img src={starBack} className="starBack" alt="starBack" />
            <img src={login} className="login12" alt="starBack" />
        </div>
    );
}

export default AdminLogin;