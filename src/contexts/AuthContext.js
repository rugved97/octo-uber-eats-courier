import { Auth, DataStore } from 'aws-amplify';
import { createContext, useContext, useEffect, useState } from 'react';
import { Courier } from '../models';

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbCourier, setDbCourier] = useState(null);
  const [loading, setLoading] = useState(true);
  const sub = authUser?.attributes.sub;
  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setAuthUser);
  }, []);

  const fetchDbCourier = () => {
    if (!sub) {
      return;
    }
    DataStore.query(Courier, courier => courier.sub('eq', sub)).then(couriers => {
      setDbCourier(couriers[0]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDbCourier();
  }, [sub]);

  useEffect(() => {
    if (!dbCourier) {
      return;
    }
    const subscription = DataStore.observe(Courier, dbCourier.id).subscribe(msg => {
      if (msg.opType === 'UPDATE') {
        setDbCourier(msg.element);
      }
    });

    return () => subscription.unsubscribe();
  }, [dbCourier]);

  const subUser = authUser?.attributes?.sub;
  return (
    <AuthContext.Provider value={{ authUser, loading, dbCourier, subUser, setDbCourier }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
