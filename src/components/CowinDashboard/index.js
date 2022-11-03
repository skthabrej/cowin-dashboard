import {Component} from 'react'
import {Circles} from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import {
  CowinDashboardContainer,
  LogoContainer,
  LogoImg,
  LogoImgTextContainer,
  LogoText,
  CowinDashBoardHeading,
  ChartsContainer,
  LoaderContainer,
  ImageFailureContainer,
  ImageFailureView,
  FailureText,
} from './styledComponents'

const apiStatusConstants = {
    initial:'INITIAL',
    inProgress:'IN_PROGRESS',
    success:'SUCCESS',
    failure:'FAILURE'
}

class CowinDashboard extends Component {
    state = {
        apiStatus: apiStatusConstants.initial,
        vaccinationData:{}
    }

    componentDidMount() {
        this.onGetCovidVaccinationData()
    }

    onGetCovidVaccinationData = async() => {
        this.setState({apiStatus:apiStatusConstants.inProgress})
        const covidVaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
        const response = await fetch(covidVaccinationDataApiUrl)

        if(response.ok === true) {
            const fetchedData = await response.json()
            console.log(fetchedData)
            const updatedData = {last7DaysVaccination: fetchedData.last_7_days_vaccination.map(eachDayData => ({
                    vaccineDate: eachDayData.vaccine_date,
                    dose1: eachDayData.dose_1,
                    dose2: eachDayData.dose_2,
                })),
                vaccinationByAge: fetchedData.vaccination_by_age.map(range => ({
                  age: range.age,
                  count: range.count,
                })),
                vaccinationByGender: fetchedData.vaccination_by_gender.map(genderType => ({
                    gender: genderType.gender,
                    count: genderType.count,
                })),
            }
            this.setState({vaccinationData:updatedData,apiStatus:apiStatusConstants.success})
        } else {
            this.setState({apiStatus:apiStatusConstants.failure})
        }
    }

    onGetLogoItems = () => (
        <LogoContainer>
          <LogoImgTextContainer><LogoImg src="https://i.postimg.cc/mrN33w9X/pngwing-com.png" alt="website logo" /></LogoImgTextContainer>
          <LogoImgTextContainer><LogoText>Co-WIN</LogoText></LogoImgTextContainer>
        </LogoContainer>
      )

    onGetLoader = () => {
        <LoaderContainer data-testid="loader">
            <Circles type="ThreeDots" color='red' height={80} width={80}/>
        </LoaderContainer>
    }

    onGetChartsItems = () => {
        const {vaccinationData} = this.state
        return(
            <ChartsContainer>
                <VaccinationCoverage dataVaccinationCoverage={vaccinationData.last7DaysVaccination}/>
                <VaccinationByGender dataVaccinationByGender={vaccinationData.vaccinationByGender}/>
                <VaccinationByAge dataVaccinationByAge={vaccinationData.vaccinationByAge}/>
            </ChartsContainer>
        )
    }

    onGetFailureView = () => {
        <ImageFailureContainer>
            <ImageFailureView src="https://i.postimg.cc/Bbtv6Ss5/not-found-g8fa222b46-1280.jpg" alt="failure-view"/>
            <FailureText>Something went wrong</FailureText>
        </ImageFailureContainer>
    }

    onGetResults = () => {
        const {apiStatus} = this.state
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return this.onGetLoader()
            case apiStatusConstants.success:
                return this.onGetChartsItems()
            case apiStatusConstants.failure:
                return this.onGetFailureView()
            default:
                return null
        }
    }

    render() {
        return (
            <CowinDashboardContainer>
                {this.onGetLogoItems()}
                <CowinDashBoardHeading>CoWin Vaccination in India</CowinDashBoardHeading>
                {this.onGetResults()}
            </CowinDashboardContainer>
        )
    }
}
export default CowinDashboard

