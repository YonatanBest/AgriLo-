import HomePage from "@/components/Home_page"
import About_Section from "@/components/Page_Components/About_Section"
import HeroSectionTwo from "@/components/Page_Components/Hero_Section_Two"
import Other_Sections from "@/components/Page_Components/Other_Sections"
import ScrollAnimation from "@/components/Page_Components/Solution_Section"
import SolutionSection from "@/components/Page_Components/Solution_Section"


function page() {
  return (
    <div>
      {/* <HomePage/> */}
      <HeroSectionTwo/>
      <ScrollAnimation/>
      <About_Section/>
      <Other_Sections/>
    </div>
  )
}

export default page