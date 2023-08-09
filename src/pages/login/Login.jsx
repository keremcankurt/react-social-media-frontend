import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { login } from '../../features/auth/authSlice';
import styles from './Login.module.scss'

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading} = useSelector(
      (state) => state.auth
    );
    useEffect(() => {
        if (user) {
          navigate("/")
        }
      }, [user,navigate]);

      const {email, password} = formData;
    const onChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
      e.preventDefault();
      const userData = {
        email,
        password,
      };
      dispatch(login(userData));
    };
  return (
    <div className={styles["container"]}>
        <div id={styles['login-container']}>
        <div className={styles['login']}>
            <form onSubmit={onSubmit} className={styles['loginForm']}>
            <h1 className={styles['login-logo']}>KCKMEDIA</h1>
                <input name='email' placeholder='Email' type='email' value={email} onChange={onChange} required/>
                <input name='password' placeholder='Password' type='password' value={password} onChange={onChange} required/>
                <Link to='/forgotpassword' className={styles['forgotPassword']}>Şifremi Unuttum</Link>
                {isLoading ? (
                <button disabled className={styles['loading']}>Giriş Yapılıyor...</button>
                ):(
                <button type='submit'>Giriş Yap</button>
                )}
                
                <Link to='/register' className={styles['goToRegister']}>Kayıt Ol</Link>
            </form>
        </div>
        </div>
    </div>
  )
}
