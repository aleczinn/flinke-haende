import type { FieldAccess, Access } from 'payload'

const isAdmin = ({ req: { user } }: any): boolean => {
  return Boolean(user?.role === 'admin')
}

export const admin: Access = isAdmin
export const adminField: FieldAccess = isAdmin
