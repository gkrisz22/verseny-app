'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { generateBreadcrumbs } from './breadcrumb-generator'

const Breadcrumb = () => {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="inline-flex items-center">
            {index < breadcrumbs.length - 1 ? (
              <>
                <Link
                  href={crumb.href}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  {crumb.label}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </>
            ) : (
              <span className="text-sm font-medium text-gray-500">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb