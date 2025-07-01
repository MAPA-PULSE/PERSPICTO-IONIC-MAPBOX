import { useEffect, useState } from "react";
import { Redirect  } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import React from "react";


interface Props {
  children: React.ReactNode;
}


const PrivateRoute: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<null | object>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? children : <Redirect to="/pages/login" />;
};

export default PrivateRoute;
