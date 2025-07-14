export interface User {
  user_id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  firebase_uid?: string;
}


export interface PrivateRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}
