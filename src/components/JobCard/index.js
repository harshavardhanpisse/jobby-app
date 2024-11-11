import {Link} from 'react-router-dom'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-item">
        <div className="job-item-header-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <FaStar className="icon" />
              <p className="title"> {rating}</p>
            </div>
          </div>
        </div>
        <div className="job-item-details">
          <div className="location-type-container">
            <IoLocationSharp className="job-item-logo" />
            <p className="text"> {location} </p>
            <BsBriefcaseFill className="job-item-logo" />
            <p className="text"> {employmentType} </p>
          </div>
          <p className="package"> {packagePerAnnum} </p>
        </div>
        <hr className="horizontal-line" />
        <div>
          <h1 className="heading">Description</h1>
          <p className="description"> {jobDescription} </p>
        </div>
      </li>
    </Link>
  )
}
export default JobCard
