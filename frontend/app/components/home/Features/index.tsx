'use client';

import {
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconBrandTeams, IconClipboardList, IconLock } from '@tabler/icons-react';
import classes from './index.module.css';

const mockdata = [
  {
    title: 'Collaborative Task Management',
    description:
      'Easily assign tasks to your team, track progress, and set deadlines. Keep everything in one place and stay organized.',
    icon: IconClipboardList,
  },
  {
    title: 'Seamless Team Collaboration',
    description:
      'Communicate and collaborate with your team in real-time. TaskFlow enables effortless interaction and file sharing within each task.',
    icon: IconBrandTeams,
  },
  {
    title: 'Top-notch Security',
    description:
      'Your data is secure with TaskFlow. We use advanced encryption methods to ensure that all your project data remains confidential and safe.',
    icon: IconLock,
  },
];

export function Features() {
  const theme = useMantineTheme();
  const features = mockdata.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <feature.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.blue[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Group justify="center">
        <Badge variant="filled" size="lg">
          Best Project Management Tool
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Effortless Project Management for Your Team
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        TaskFlow helps your team stay organized and focused, turning chaos into smooth workflows.
        Achieve your goals faster with a tool designed for efficiency.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}
