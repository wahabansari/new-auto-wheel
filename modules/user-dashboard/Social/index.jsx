'use client';
import React from 'react';
import { Tabs } from '@mantine/core';
import Followers from './Followers';
import Following from './Following';
import useSocial from './useSocial';
import classes from './Social.module.css';
import { signIn, useSession, SessionProvider } from 'next-auth/react';

export default function Social() {
  const { data: session, status } = useSession();

  const {
    activeTab,
    handleChangeTab,
  } = useSocial();

  return (
    <>
   {session?.user?._id &&   <Tabs value={activeTab} onChange={handleChangeTab} color="#E90808" classNames={classes}>
        <Tabs.List>
          <Tabs.Tab value="followers">Followers</Tabs.Tab>
          <Tabs.Tab value="following">Following</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="followers">
          <Followers userId={session?.user?._id}/>
        </Tabs.Panel>
        <Tabs.Panel value="following">
          <Following userId={session?.user?._id} />
        </Tabs.Panel>
      </Tabs>}
    </>
  )
}
