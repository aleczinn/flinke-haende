import type { FieldAccess, Access } from 'payload'

export const admin: Access = ({ req: { user } }) => Boolean(user?.role === 'admin')
export const adminField: FieldAccess = ({ req: { user } }) => Boolean(user?.role === 'admin')
