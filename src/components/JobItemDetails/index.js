import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'

import SkillCard from '../SkillCard'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobItemList: {},
    similarJobItemList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItem()
  }

  getFormattedSkillData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    id: data.id,
    rating: data.rating,
    location: data.location,
    title: data.title,
  })

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    rating: data.rating,
    title: data.title,
    packagePerAnnum: data.package_per_annum,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
  })

  getJobItem = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data.job_details)
      const updatedSkillData = data.similar_jobs.map(eachSimilarJob =>
        this.getFormattedSkillData(eachSimilarJob),
      )
      this.setState({
        jobItemList: updatedData,
        similarJobItemList: updatedSkillData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobItemDetailsView = () => {
    const {jobItemList, similarJobItemList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      title,
      rating,
      packagePerAnnum,
      lifeAtCompany,
      skills,
    } = jobItemList
    const {description, imageUrl} = lifeAtCompany

    return (
      <div className="job-item-details-container">
        <Header />
        <div className="job-item-details-top-section-container">
          <div className="job-item-header-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <h1 className="title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="icon" />
                <p className="title"> {rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-details">
            <div className="location-type-container">
              <GoLocation className="job-item-logo" />
              <p className="text"> {location} </p>
              <BsBriefcaseFill className="job-item-logo" />
              <p className="text"> {employmentType} </p>
            </div>
            <p className="package"> {packagePerAnnum} </p>
          </div>
          <hr className="horizontal-line" />
          <div className="description-link-container">
            <h1 className="heading">Description</h1>
            <a href={companyWebsiteUrl} className="link">
              Visit
              <BiLinkExternal className="link-icon" />
            </a>
          </div>
          <p className="description"> {jobDescription} </p>
          <h1 className="heading"> Skills </h1>
          <ul className="skills-list-container">
            {skills.map(skill => (
              <SkillCard skillData={skill} key={skill.name} />
            ))}
          </ul>
          <h1 className="heading"> Life at Company </h1>
          <div className="job-item-footer-container">
            <p className="description wid">{description} </p>
            <img src={imageUrl} className="image" alt="life at company" />
          </div>
        </div>
        <div className="job-item-details-bottom-section-container">
          <h1 className="similar-jobs-text">Similar Jobs</h1>
          <ul className="similar-jobs-container">
            {similarJobItemList.map(eachItem => (
              <SimilarJobItem key={eachItem.id} itemDetails={eachItem} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="error-no-jobs-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className="no-jobs-failure-img"
      />
      <h1 className="no-jobs-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="no-jobs-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="retry-btn" type="button" onClick={this.getJobItem}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="jobs-loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default JobItemDetails
