import styled from "styled-components";
import { motion } from "framer-motion";

interface Menu {
  name: string;
}

interface SidebarItemProps {
  menu: Menu;
}

const SidebarItemWrapper = styled(motion.div)`
  margin: 20px;
  color: #ffffff;
  display: inline-block;
  cursor: pointer;
  font-size: 5vmin;
  font-weight: 300;
  transition: font-weight 200ms ease-in-out;
`;

export default function SidebarItem({ menu }: SidebarItemProps) {
  return (
    <SidebarItemWrapper
      whileHover={{
        scale: 1.2,
        rotate: 360,
        color: "rgb(25, 255, 94)",
      }}
    >
      {menu.name}
    </SidebarItemWrapper>
  );
}
