import { IconFullLogo, IconFullLogoLight } from '@/components/icons'

export function BrandLogo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
    const Logo = inverse ? IconFullLogoLight : IconFullLogo
    return <Logo className={className} />
}
