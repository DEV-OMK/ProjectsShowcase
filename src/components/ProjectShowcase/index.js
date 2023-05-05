import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProjectShowcase extends Component {
  state = {
    activeId: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {activeId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeId}`

    const response = await fetch(apiUrl)
    const data = await response.json()

    if (response.ok) {
      const {projects} = data
      const updatedProjects = projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))

      this.setState({
        projectsList: updatedProjects,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeActiveId = event => {
    this.setState({activeId: event.target.value}, this.getProjectsList)
  }

  retry = () => {
    this.getProjectsList()
  }

  renderHeader = () => (
    <nav className="navbar">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
        alt="website logo"
        className="website-logo"
      />
    </nav>
  )

  renderSelectInput = () => {
    const {activeId} = this.state

    return (
      <select
        className="select-input"
        value={activeId}
        onChange={this.onChangeActiveId}
      >
        {categoriesList.map(category => (
          <option key={category.id} value={category.id}>
            {category.displayText}
          </option>
        ))}
      </select>
    )
  }

  renderProjectsList = () => {
    const {projectsList} = this.state

    return (
      <ul className="project-list-container">
        {projectsList.map(eachProject => (
          <li key={eachProject.id} className="project-card">
            <img
              src={eachProject.imageUrl}
              alt={eachProject.name}
              className="project-image"
            />
            <div className="name-container">
              <p className="project-name">{eachProject.name}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height={50} width={50} color="#328af2" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-title">Oops! Something Went Wrong</h1>
      <p className="failure-caption">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button" onClick={this.retry}>
        Retry
      </button>
    </div>
  )

  renderProjectShowcase = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProjectsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-container">
        {this.renderHeader()}
        <div className="responsive-container">
          {this.renderSelectInput()}
          {this.renderProjectShowcase()}
        </div>
      </div>
    )
  }
}

export default ProjectShowcase
