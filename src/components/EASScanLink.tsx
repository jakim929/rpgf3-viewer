import { Button } from '@/components/ui/button'
import { EASScanBaseUrls } from '@/constants/EASScanBaseUrls'

export const EASScanLink = ({
  chainId,
  attestationUid,
}: { chainId: number; attestationUid: string }) => {
  const baseUrl = EASScanBaseUrls[chainId]
  return (
    <Button
      variant="link"
      href={`${baseUrl}/attestation/view/${attestationUid}`}
    >
      View on EASScan
    </Button>
  )
}
