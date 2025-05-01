import React from 'react'
import StatisticsSection from './_components/dashboard/statistics-section'

const OrganizationPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Szervezet</h1>
      </div>
      <StatisticsSection />

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Versenynaptár</h2>

        <iframe
          src="https://calendar.google.com/calendar/u/0/embed?title=Tanulm%C3%A1nyi+versenyek&height=600&wkst=2&bgcolor=%23FFFFFF&src=ss881teo41uk82ir2g5p4bk6l0@group.calendar.google.com&color=%23182C57&src=rsd5iorkti3b2fuclehukn95s0@group.calendar.google.com&color=%23B1440E&src=omhgl1n9epdsefcu087cqouie0@group.calendar.google.com&color=%2342104A&src=hu.hungarian%23holiday@group.v.calendar.google.com&color=%23125A12&ctz=Europe/Budapest&hl=hu&pli=1"
          className="w-full min-h-[800px] dark:invert rounded-lg"
        ></iframe>
      </div>
    </div>
  );
}

export default OrganizationPage