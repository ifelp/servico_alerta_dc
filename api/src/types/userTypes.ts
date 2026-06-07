
export interface CreateUserDTO{
    name: string,
    email: string,
    rawPassword: string
}

export interface UserResponseDTO{
    id: number,
    name: string,
    email: string,
}

export type UpdateUserDTO = Partial<CreateUserDTO>;