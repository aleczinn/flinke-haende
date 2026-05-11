import type { Access } from 'payload'

export const admin: Access = ({ req: { user } }): boolean => {
  return Boolean(user?.role === 'admin')
}
