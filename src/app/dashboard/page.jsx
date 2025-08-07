"use client";
import React, { useState, useEffect } from 'react';
import SidePanel from '../components/SidePanel';
import SearchBar from '../components/SearchBar';
import FilterButtons from '../components/Filterbtn';
import AlertCard from '../components/AlertCard';
import useTrafficSocket from '../components/useTrafficSocket';

function Page() {
  const [alerts, setAlerts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchedPlace, setSearchedPlace] = useState('');
  const [sensorData, setSensorData] = useState([]);

  useTrafficSocket((newEntry) => {
    const id = `${newEntry.place}-${newEntry.latitude}-${newEntry.longitude}`;
    setSensorData((prev) => {
      if (prev.some((e) => e.id === id)) return prev;
      return [...prev, { ...newEntry, id }];
    });
  });

  useEffect(() => {
    const newAlerts = sensorData.filter(entry =>
      entry.alert && entry.alert.toLowerCase() !== "none"
    );
    setAlerts(newAlerts);
  }, [sensorData]);

  const filteredAlerts = alerts.filter(alert =>
    activeFilter === 'All' || alert.alert.toLowerCase() === activeFilter.toLowerCase()
  );

  return (
    <div className='w-screen bg-[#262626] flex'>
      <SidePanel />
      <div className='alert flex-1 bg-[#262626] flex flex-col items-center justify-start p-6 space-y-8'>
        <SearchBar setSearchedPlace={setSearchedPlace} />
        <FilterButtons setActiveFilter={setActiveFilter} />
        <div className='alertblock w-full flex-1'>
          <h1 className='text-white text-sm font-semibold'>
            Ongoing Alerts ({filteredAlerts.length})
          </h1>
          <div className='alert-container w-full h-[55vh] flex-1 overflow-y-scroll space-y-4'>
            {filteredAlerts.map((alert, index) => (
              <AlertCard
                key={index}
                title={alert.alert || "Alert"}
                location={alert.place || "Unknown Location"}
                description={alert.description || "Detected · High Severity · Collision or Traffic Disruption"}
                time={alert.time || "N/A"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
