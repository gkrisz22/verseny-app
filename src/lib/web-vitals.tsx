'use client'
 
import { useReportWebVitals } from 'next/web-vitals'
 
export function WebVitals() {
  useReportWebVitals((metric) => {
  })

  return <></>
}

// https://nextjs.org/docs/app/building-your-application/optimizing/analytics#web-vitals