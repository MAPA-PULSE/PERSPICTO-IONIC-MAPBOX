import { useState } from "react";
import { useHistory } from "react-router-dom";
import { handleRegister } from "../utils/registerUtils";

export default function useRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const onRegister = async () => {
    setLoading(true);
    const { success, message } = await handleRegister({
      name,
      email,
      password,
      setShowToast,
      setToastMessage,
      history,
    });
    setLoading(false);

    if (success) clearFields();
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    showToast,
    setShowToast,
    toastMessage,
    loading,
    onRegister,
    clearFields,
  };
}
