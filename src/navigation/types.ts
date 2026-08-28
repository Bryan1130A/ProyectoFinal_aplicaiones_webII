export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Movements: undefined;
  CreateMovement: undefined;
  EditMovement: { movementId: number };
  MovementDetail: { movementId: number };
};
