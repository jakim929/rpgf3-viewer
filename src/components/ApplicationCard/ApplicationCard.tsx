import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Link } from 'react-router-dom'
import { useApplicationMetadata } from '@/lib/useApplicationMetadata'

type Props = {
  project: any
}

const ApplicationCard = ({ project }: Props) => {
  const displayName = project?.attestation?.displayName
  const projectId = project?.id
  const metadataPTR = project?.attestation?.applicationMetadataPtr

  const { data } = useApplicationMetadata(metadataPTR)

  return (
    <div className="rounded-xl overflow-hidden">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="p-5">
            <div className="text-left">
              <p>
                <span className="text-gray-400 font-normal">Display name:</span>{' '}
                {displayName}
              </p>
              <p>
                <span className="text-gray-400">Project ID:</span> {projectId}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ApplicantDetails details={data} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

const ApplicantDetails = ({ details }: any) => {
  if (details === undefined) {
    return <div>Loading...</div>
  }
  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md text-left flex flex-col gap-3 ">
      <p>
        <strong>Applicant Type:</strong>{' '}
        <span className="bg-gray-700 p-1 px-2 rounded-xl">
          {details.applicantType}
        </span>
      </p>
      <p>
        <strong>Website URL:</strong>{' '}
        <Link
          to={details.websiteUrl}
          target="_blank"
          className="text-blue-500 underline"
        >
          {details.websiteUrl}
        </Link>
      </p>
      <p>
        <strong>Bio:</strong>{' '}
        <span className="text-gray-300">{details.bio}</span>
      </p>
      <p>
        <strong>Contribution Description:</strong>{' '}
        <span className="text-gray-300">{details.contributionDescription}</span>
      </p>
      <div>
        <p>
          <strong>Contribution Links:</strong>
        </p>
        <ul className="list-disc pl-5">
          {details.contributionLinks.map((link, index) => (
            <li key={index}>
              <span className="font-semibold">{link.type}:</span>{' '}
              <Link
                to={link.url}
                target="_blank"
                className="text-blue-500 underline"
              >
                {link.description}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p>
        <strong>Impact Category:</strong>{' '}
        <span className="bg-gray-700 p-1 px-2 rounded-xl">
          {details.impactCategory.join(', ')}
        </span>
      </p>
      <p>
        <strong>Impact Description:</strong>{' '}
        <span className="text-gray-300">{details.impactDescription}</span>
      </p>

      <div>
        <p>
          <strong>Impact Metrics:</strong>
        </p>
        <ul className="list-disc pl-5">
          {details.impactMetrics.map((metric, index) => (
            <li key={index}>
              <span className="font-semibold">{metric.description}:</span>{' '}
              {metric.number} (
              <Link
                to={metric.url}
                target="_blank"
                className="text-blue-500 underline"
              >
                source
              </Link>
              )
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p>
          <strong>Funding Sources:</strong>
        </p>
        <ul className="list-disc pl-5">
          {details.fundingSources.map((source, index) => (
            <li key={index}>
              <span className="font-semibold">{source.type}:</span>{' '}
              {source.currency} {source.amount} {source.description}
            </li>
          ))}
        </ul>
      </div>

      <p>
        <strong>Payout Address:</strong>{' '}
        <span className="text-gray-300">{details.payoutAddress}</span>
      </p>
    </div>
  )
}

export default ApplicantDetails

export { ApplicationCard }
