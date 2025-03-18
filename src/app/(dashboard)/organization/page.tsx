import React from 'react'
import StatisticsSection from './_components/dashboard/statistics-section'

const OrganizationPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Szervezet</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your organization's activities</p>
      </div>
        <StatisticsSection />
    </div>
  )
}

export default OrganizationPage