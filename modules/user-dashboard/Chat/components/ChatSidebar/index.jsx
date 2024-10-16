import React from 'react';
import { ScrollArea, Box, Group, Avatar, Text } from '@mantine/core';
import styles from './ChatSidebar.module.css';
import Search from '@/components/user-dashboard/Search';

export default function ChatSidebar({ conversations, onSelectUser, selectedUserId }) {
  const setSearchBy = (value) => {
    // Implement search functionality if needed
    console.log('Search value:', value);
  };

  return (
    <Box className={styles.sidebar}>
      <Box className={styles.sidebarHeader}>
        <Search setSearchBy={setSearchBy} />
      </Box>
      <Box className={styles.sidebarContent}>
        <ScrollArea h="100%">
          <ul className={styles.sidebarList}>
            {conversations.map((conversation) => {
              const isSelected = conversation.otherUser.id === selectedUserId;
              return (
                <li
                  key={conversation.id}
                  className={`${styles.sidebarListItem} ${isSelected ? styles.selected : ''}`}
                  onClick={() => onSelectUser(conversation.otherUser.id)}
                >
                  <Group gap={16}>
                    <Avatar
                      src={conversation.otherUser.avatar || 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png'}
                      radius="xl"
                      size={48}
                    />
                    <div style={{ flex: 1 }}>
                      <Box className={styles.userName}>
                        {conversation.otherUser.name}
                      </Box>
                      <Box className={styles.userMsg}>
                        {conversation.lastMessage.content}
                      </Box>
                    </div>
                  </Group>
                  <Box className={styles.userTime}>
                    <Text size="xs" color="dimmed">
                      {new Date(conversation.lastMessage.createdAt).toLocaleTimeString()}
                    </Text>
                  </Box>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </Box>
    </Box>
  );
}