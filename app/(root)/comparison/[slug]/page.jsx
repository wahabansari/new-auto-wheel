import React from 'react'
import ComparisonDetails from "@/modules/car-comparison/detail";
const ComparisonDetailsPage = (params,searchParams) => {
  return (
    <div>
      <ComparisonDetails params={params} searchParams={searchParams}/>
    </div>
  )
}

export default ComparisonDetailsPage