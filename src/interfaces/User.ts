export interface GetUserProps{
    account: string,
    audience: string,
    isRepresentative: boolean,
    tokenType: string,
    user: string,
    userId: string,
    userType: string
}

export interface SetUserProps{
    user_email: string,
    organization_name: string,
    project_name: string,
    vtex_account: string
}

