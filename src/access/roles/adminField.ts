import type { FieldAccess } from 'payload'

export const adminField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin')
}
