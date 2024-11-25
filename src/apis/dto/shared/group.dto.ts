export interface GlobalGroupDto {
  id: string;
  identifier: string;
  name: string;
}

export class GlobalGroupDtoImpl implements GlobalGroupDto {
  id!: string;
  name!: string;
  identifier!: string;

  static fromGroup(group: GlobalGroupDto): GlobalGroupDto {
    return {
      id: group.id,
      identifier: group.identifier,
      name: group.name,
    };
  }
}
