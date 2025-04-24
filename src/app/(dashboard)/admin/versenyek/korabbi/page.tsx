import { getAcademicYears } from '@/app/_data/settings.data';
import React from 'react'

const KorabbiVersenyekPage = async () => {
    const academicYears = await getAcademicYears();
    return (
        <div></div>
    )
}

export default KorabbiVersenyekPage