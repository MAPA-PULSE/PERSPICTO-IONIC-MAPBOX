import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../../common/firebase/firebase"; 
import { handleLogin } from "../utils/loginUtils"; 

function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        history.replace("/profile");
      }
    });
    return () => unsubscribe();
  }, [history]);

  const onLogin = async () => {
    if (loading) return; 

    setLoading(true);
    const { success, message } = await handleLogin(email, password);
    setLoading(false);

    setToastMessage(message);
    setShowToast(true);

    if (success) {
      setTimeout(() => history.push("/home"), 1500);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showToast,
    setShowToast,
    toastMessage,
    onLogin,
    loading,
  };
}

export default useLogin;
