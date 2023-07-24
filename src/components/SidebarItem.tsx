import styled from "styled-components";

interface Menu {
  name: string;
}

interface SidebarItemProps {
  menu: Menu;
}

const SidebarItemWrapper = styled.div`
  width: 100px;
  height: 80px;
  background-color: #212529;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function SidebarItem({ menu }: SidebarItemProps) {
  return <SidebarItemWrapper>{menu.name}</SidebarItemWrapper>;
}
