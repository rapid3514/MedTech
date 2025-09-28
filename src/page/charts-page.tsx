
import Charts from '../components/admincomp/charts/charts'
import SpringChart from '../components/admincomp/charts/Spring-chart'
import CircleChart from '../components/admincomp/charts/circle-chart'

const Chartspage = () => {
  return (
    <div>
        <div className="p-4">
      <div className="grid grid-cols-2">
          <Charts/>
          <SpringChart/>
        <CircleChart/>
      </div>
        
      </div>
    </div>
  )
}

export default Chartspage