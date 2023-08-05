import styled from "styled-components";

interface Menu {
  name: string;
}

interface SidebarItemProps {
  menu: Menu;
}

const SidebarItemWrapper = styled.p`
  margin: 20px;
  color: #ffffff;
  display: inline-block;
  cursor: pointer;
  font-size: 5vmin;
  font-weight: 300;
  transition: font-weight 200ms ease-in-out;

  &:hover {
    color: rgb(25, 255, 94);
    font-weight: 1000;
    font-size: 6vmin;
  }
`;

export default function SidebarItem({ menu }: SidebarItemProps) {
  return <SidebarItemWrapper>{menu.name}</SidebarItemWrapper>;
}
