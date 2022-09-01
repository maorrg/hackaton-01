import React from "react";
import { MdOutlinePersonPin } from "react-icons/md";
import { FaRegBuilding, FaShoppingBasket, FaUserAlt } from "react-icons/fa";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { MenuItem } from "@mantine/core/lib/Menu/MenuItem/MenuItem";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  route: string;
}

function MainLink({ icon, color, label, route }: MainLinkProps) {
  const router = useRouter();
  return (
    <UnstyledButton
      sx={(theme) => ({
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
      })}
      onClick={() => router.push(route)}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const menuItems = [
  {
    icon: <FaRegBuilding size={16} />,
    color: "blue",
    label: "Feedback",
    route: "/feedback",
    role: ["ADMIN", "STUDENT"],
  },
  {
    icon: <MdOutlinePersonPin size={16} />,
    color: "teal",
    label: "Results",
    route: "/results",
    role: ["ADMIN", "TEACHER"],
  },
];

export function GetCurrentRoute(route: string): any {
  for (const item of menuItems) {
    if (item.route === route) return item;
  }
}

export function MainLinks() {
  const { data: session, status } = useSession();
  const links = menuItems.map((link) => {
    if (link.role.includes(session?.user.role!)) {
      return <MainLink {...link} key={link.label} />;
    }
  });
  return <div>{links}</div>;
}
