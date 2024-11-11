import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import './index.css'

const SimilarJobItem = props => {
  const {itemDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = itemDetails

  return (
    <li className="similar-job-item">
      <div className="job-item-header-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-company-logo"
        />
        <div>
          <h1 className="similar-title">{title}</h1>
          <div className="rating-container">
            <FaStar className="icon" />
            <p className="similar-title"> {rating}</p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="similar-heading">Description</h1>
        <p className="similar-description"> {jobDescription} </p>
      </div>
      <div className="similar-job-item-details">
        <IoLocationSharp className="job-item-logo" />
        <p className="similar-text"> {location} </p>
        <BsBriefcaseFill className="job-item-logo" />
        <p className="similar-text"> {employmentType} </p>
      </div>
    </li>
  )
}
export default SimilarJobItem
