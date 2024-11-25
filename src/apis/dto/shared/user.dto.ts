export interface GlobalUserDto {
  id: string;
  name: string;
  username: string;
  birthday: Date;
  acceptQuestion: boolean;
  email: string;
  role: string;
  verifiedAt: Date;
  profilePicture: string;
  status?: GlobalUserStatusDto;
  vip: boolean;
}

export interface GlobalUserStatusDto {
  id: string;
  userStatus: string;
  expired: Date;
}

export class GlobalUserDtoImpl implements GlobalUserDto {
  id!: string;
  name!: string;
  username!: string;
  birthday!: Date;
  acceptQuestion!: boolean;
  email!: string;
  role!: string;
  verifiedAt!: Date;
  profilePicture!: string;
  status?: GlobalUserStatusDto;
  vip!: boolean;

  static fromUser(user: GlobalUserDto): GlobalUserDto {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      birthday: user.birthday,
      acceptQuestion: user.acceptQuestion,
      email: user.email,
      role: user.role,
      verifiedAt: user.verifiedAt,
      profilePicture: user.profilePicture,
      status: user.status,
      vip: user.vip,
    };
  }
}
