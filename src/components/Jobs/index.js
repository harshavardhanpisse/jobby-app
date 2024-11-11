import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {v4 as uuidv4} from 'uuid'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileData: '',
    jobsList: [],
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    searchInput: '',
    activeEmploymentTypesList: [],
    activeSalaryRangeId: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  onClickProfileRetryButton = () => {
    this.getProfile()
  }

  onClickJobsRetryButton = () => {
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({
      profileApiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        profileData: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        profileApiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderProfileLoadingView = () => (
    <div className="profile-loader-error-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <div className="profile-loader-error-container">
      <button
        className="retry-btn"
        type="button"
        onClick={this.onClickProfileRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-container">
        <img src={profileImageUrl} className="profile-img" alt="profile" />
        <h1 className="profile-name"> {name} </h1>
        <p className="profile-description"> {shortBio} </p>
      </div>
    )
  }

  renderProfileStatus = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderProfileLoadingView()
      default:
        return null
    }
  }

  getJobs = async () => {
    this.setState({
      jobsApiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {activeEmploymentTypesList, activeSalaryRangeId, searchInput} =
      this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentTypesList.join()}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsApiStatus: apiStatusConstants.success,
        jobsList: updatedData,
      })
    } else {
      this.setState({
        jobsApiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div testid="loader" className="jobs-loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

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
      <button
        className="retry-btn"
        type="button"
        onClick={this.onClickJobsRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderJobsListView = () => {
    const {jobsList} = this.state
    const shouldShowJobsList = jobsList.length > 0

    return shouldShowJobsList ? (
      <ul className="jobs-list-container">
        {jobsList.map(job => (
          <JobCard jobData={job} key={uuidv4()} />
        ))}
      </ul>
    ) : (
      <div className="error-no-jobs-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-failure-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-failure-heading-text">No Jobs Found</h1>
        <p className="no-jobs-failure-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderJobsStatus = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  changeSalary = activeSalaryRangeId => {
    this.setState({activeSalaryRangeId}, this.getJobs)
  }

  changeEmploymentType = activeEmploymentTypeId => {
    const {activeEmploymentTypesList} = this.state

    if (activeEmploymentTypesList.includes(activeEmploymentTypeId)) {
      const filteredList = activeEmploymentTypesList.filter(
        eachItem => activeEmploymentTypeId !== eachItem,
      )
      this.setState(
        {
          activeEmploymentTypesList: filteredList,
        },
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({
          activeEmploymentTypesList: [
            ...prevState.activeEmploymentTypesList,
            activeEmploymentTypeId,
          ],
        }),
        this.getJobs,
      )
    }
  }

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  onClickSearchBtn = () => {
    this.getJobs()
  }

  render() {
    const {activeEmploymentTypesList, searchInput, activeSalaryRangeId} =
      this.state
    return (
      <>
        <Header />
        <div className="jobs-section">
          <div className="profile-filters-container">
            <div className="search-input-sm-container">
              <input
                value={searchInput}
                type="search"
                className="search-input"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                className="search-button"
                type="button"
                testid="searchButton"
                onClick={this.onClickSearchBtn}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderProfileStatus()}
            <hr className="horizontal-line" />
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              activeEmploymentTypesList={activeEmploymentTypesList}
              changeEmploymentType={this.changeEmploymentType}
              salaryRangesList={salaryRangesList}
              activeSalaryRangeId={activeSalaryRangeId}
              changeSalary={this.changeSalary}
            />
          </div>
          <div className="search-jobs-container">
            <div className="search-input-md-container">
              <input
                value={searchInput}
                type="search"
                className="search-input"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                className="search-button"
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearchBtn}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
