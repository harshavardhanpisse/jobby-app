import './index.css'

const FiltersGroup = props => {
  const renderSalaryRangeList = () => {
    const {salaryRangesList} = props

    return salaryRangesList.map(salary => {
      const {changeSalary} = props
      const onChangeSalaryInput = () => changeSalary(salary.salaryRangeId)

      return (
        <li
          onChange={onChangeSalaryInput}
          className="filter-item"
          key={salary.salaryRangeId}
        >
          <input
            className="input"
            type="radio"
            name="range"
            id={salary.salaryRangeId}
          />
          <label className="label" htmlFor={salary.salaryRangeId}>
            {salary.label}
          </label>
        </li>
      )
    })
  }

  const renderSalaryRangeFilters = () => (
    <div>
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="filter-list">{renderSalaryRangeList()}</ul>
    </div>
  )

  const renderEmploymentTypeslist = () => {
    const {employmentTypesList} = props

    return employmentTypesList.map(employment => {
      const {changeEmploymentType} = props
      const onChnageEmploymentTypeInput = event =>
        changeEmploymentType(event.target.value)

      return (
        <li
          onChange={onChnageEmploymentTypeInput}
          className="filter-item"
          key={employment.employmentTypeId}
        >
          <input
            className="input"
            type="checkbox"
            id={employment.employmentTypeId}
            value={employment.employmentTypeId}
          />
          <label className="label" htmlFor={employment.employmentTypeId}>
            {employment.label}
          </label>
        </li>
      )
    })
  }

  const renderEmploymentTypesFilters = () => (
    <>
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="filter-list">{renderEmploymentTypeslist()}</ul>
    </>
  )

  return (
    <div className="filters-group-container">
      {renderEmploymentTypesFilters()}
      <hr className="horizontal-line" />
      {renderSalaryRangeFilters()}
    </div>
  )
}

export default FiltersGroup
