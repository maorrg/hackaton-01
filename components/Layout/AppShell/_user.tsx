import React from "react";
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi";
import { useSession } from "next-auth/react";

export function User() {
  const theme = useMantineTheme();
  const { data: session, status } = useSession();
  
  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <UnstyledButton
        sx={{
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
      >
        <Group>
          <Avatar src={session?.user.image} radius="xl" />
          <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {session?.user.name}
            </Text>
            <Text color="dimmed" size="xs">
              {session?.user.email}
            </Text>
          </Box>

          {theme.dir === "ltr" ? (
            <HiOutlineChevronRight size={18} />
          ) : (
            <HiOutlineChevronRight size={18} />
          )}
        </Group>
      </UnstyledButton>
    </Box>
  );
}
