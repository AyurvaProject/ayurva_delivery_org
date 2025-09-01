import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useAuthCheck = (requiredRole) => {
    const { isAuthenticated, loading, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [checking, setChecking] = useState(true);

    useEffect(()=>{
        if(!loading){
            if(!isAuthenticated){
                navigate('/login', {state: {from: location}, replace: true});
            }else if(requiredRole && user.role !== requiredRole){
                navigate('/login', {state: {from: location}, replace: true});
            }else{
                setChecking(false);
            }
        }
    }, [isAuthenticated, loading, user, requiredRole, navigate, location]);

    return { isAuthenticated, loading, user, checking };
}