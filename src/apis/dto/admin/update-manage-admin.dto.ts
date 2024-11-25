export type UpdateManageAdminDto = {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  key: string;
  id: string;
};

export type UpdateManageAdminResponseDto = {
  message: string;
};
