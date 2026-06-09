import { revalidateTag } from 'next/cache'
import type { GlobalAfterChangeHook } from 'payload'

export const revalidateCompany: GlobalAfterChangeHook = ({ req }) => {
    req.payload.logger.info('Revalidating: company')
    revalidateTag('company', 'max')
}

export const revalidateHeader: GlobalAfterChangeHook = ({ req }) => {
    req.payload.logger.info('Revalidating: header')
    revalidateTag('header', 'max')
}

export const revalidateFooter: GlobalAfterChangeHook = ({ req }) => {
    req.payload.logger.info('Revalidating: footer')
    revalidateTag('footer', 'max')
}
