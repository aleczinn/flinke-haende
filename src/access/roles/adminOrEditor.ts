import type { Access } from 'payload'

export const adminOrEditor: Access = ({ req: { user } }): boolean => {
  return Boolean(user?.role === 'admin' || user?.role === 'editor')
}
