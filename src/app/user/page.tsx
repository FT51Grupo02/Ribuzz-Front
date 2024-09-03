import SideBar from '@/components/SideBar/SideBar';
import UserSettings from '@/components/UserSettings/UserSettings';
import Link from 'next/link';
import React from 'react';

const Settings = () => {

  return (
    <SideBar>
      <UserSettings />
    </SideBar>
  );
};

export default Settings;