import React from 'react'

const SettingsPage = () => {
  return (
    <div>
        <div className='space-y-0.5'>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Beállítások
            </h1>
            <p className='text-muted-foreground'>
            Itt találhatók a versenyekkel kapcsolatos beállítások.
            </p>
        </div>
        <div className="flex flex-col w-full space-y-4">
            {/* Add your settings components here */}
        </div>
    </div>
  )
}

export default SettingsPage