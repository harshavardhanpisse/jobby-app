import './index.css'

const SkillCard = props => {
  const {skillData} = props
  const {imageUrl, name} = skillData

  return (
    <li className="skill-item-container">
      <img src={imageUrl} className="skill-image" alt={name} />
      <p className="skill-text">{name} </p>
    </li>
  )
}

export default SkillCard
