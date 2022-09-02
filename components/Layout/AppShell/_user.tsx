import { forwardRef } from "react";
import {
  Group,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  Box,
} from "@mantine/core";
import { useSession, signOut } from "next-auth/react";
import { FiChevronRight } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/router";
import { MdOutlineSecurity } from "react-icons/md";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  image?: string;
  name?: string;
  email?: string;
  icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.md,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" />
        <Box sx={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </Box>
        <FiChevronRight size={18} />
      </Group>
    </UnstyledButton>
  )
);

export function User() {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <Group position="center">
      <Menu withArrow position="right" shadow="md" width={200}>
        <Menu.Target>
          <UserButton
            image={session?.user.image!}
            name={session?.user.name!}
            email={session?.user.email!}
          />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Cuenta</Menu.Label>
          <Menu.Item onClick={() => signOut()} icon={<FiLogOut size={14} />}>
            Cerrar Sesión
          </Menu.Item>
          <Menu.Item onClick={() => router.replace("/security-settings")} icon={<MdOutlineSecurity size={14} />}>
            Ajustes de seguridad
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
